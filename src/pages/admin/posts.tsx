import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  published: boolean;
  author: { name: string };
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role !== 'ADMIN') {
        window.location.href = '/';
      } else {
        fetch('/api/admin/posts')
          .then(res => res.json())
          .then(data => {
            setPosts(data.posts || []);
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to load posts');
            setLoading(false);
          });
      }
    });
  }, []);

  const handlePublish = async (id: string, publish: boolean) => {
    await fetch('/api/admin/posts/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, publish }),
    });
    setPosts(posts => posts.map(p => p.id === id ? { ...p, published: publish } : p));
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/admin/posts/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setPosts(posts => posts.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Posts</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Published</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id} className="border-t">
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.author?.name || 'Unknown'}</td>
              <td className="p-2">{post.published ? 'Yes' : 'No'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handlePublish(post.id, !post.published)} className="px-2 py-1 bg-yellow-400 rounded">
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => handleDelete(post.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
