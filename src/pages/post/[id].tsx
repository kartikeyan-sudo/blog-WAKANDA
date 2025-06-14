import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/post/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post || null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/post/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data.comments || []));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/post/${id}/likes`)
      .then(res => res.json())
      .then(data => {
        setLikes(data.count || 0);
        setLiked(data.liked || false);
      });
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');
    setCommentSuccess('');
    const session = await getSession();
    if (!session) {
      setCommentError('You must be logged in to comment.');
      return;
    }
    const res = await fetch(`/api/post/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment }),
    });
    const data = await res.json();
    if (!res.ok) setCommentError(data.error || 'Failed to add comment');
    else {
      setCommentSuccess('Comment added!');
      setComment('');
      setComments(comments => [...comments, data.comment]);
    }
  };

  const handleLike = async () => {
    const session = await getSession();
    if (!session) return alert('You must be logged in to like posts.');
    const res = await fetch(`/api/post/${id}/likes`, { method: 'POST' });
    const data = await res.json();
    setLikes(data.count);
    setLiked(data.liked);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-8 text-center">Post not found.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-500 text-sm mb-4">By {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}</div>
      <div className="prose dark:prose-invert max-w-none mb-8">{post.content}</div>
      <div className="flex items-center gap-2 mb-8">
        <button onClick={handleLike} className={`px-3 py-1 rounded ${liked ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          {liked ? 'Unlike' : 'Like'}
        </button>
        <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Comments</h2>
        <form onSubmit={handleComment} className="mb-4">
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Comment</button>
        </form>
        {commentError && <div className="text-red-500 mb-2">{commentError}</div>}
        {commentSuccess && <div className="text-green-600 mb-2">{commentSuccess}</div>}
        <ul className="space-y-2">
          {comments.map(c => (
            <li key={c.id} className="border-b pb-2">
              <div className="text-sm text-gray-700">{c.author?.name || 'Unknown'} on {new Date(c.createdAt).toLocaleDateString()}</div>
              <div>{c.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
