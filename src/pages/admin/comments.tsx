import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

interface Comment {
  id: string;
  content: string;
  blocked: boolean;
  post: { title: string };
  author: { name: string };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role !== 'ADMIN') {
        window.location.href = '/';
      } else {
        fetch('/api/admin/comments')
          .then(res => res.json())
          .then(data => {
            setComments(data.comments || []);
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to load comments');
            setLoading(false);
          });
      }
    });
  }, []);

  const handleBlock = async (id: string, block: boolean) => {
    await fetch('/api/admin/comments/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, block }),
    });
    setComments(comments => comments.map(c => c.id === id ? { ...c, blocked: block } : c));
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/admin/comments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setComments(comments => comments.filter(c => c.id !== id));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Comments</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Content</th>
            <th className="p-2">Post</th>
            <th className="p-2">Author</th>
            <th className="p-2">Blocked</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id} className="border-t">
              <td className="p-2">{comment.content}</td>
              <td className="p-2">{comment.post?.title || 'Unknown'}</td>
              <td className="p-2">{comment.author?.name || 'Unknown'}</td>
              <td className="p-2">{comment.blocked ? 'Yes' : 'No'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleBlock(comment.id, !comment.blocked)} className="px-2 py-1 bg-yellow-400 rounded">
                  {comment.blocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => handleDelete(comment.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
