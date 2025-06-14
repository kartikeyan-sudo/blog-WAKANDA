import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        router.replace('/');
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li><a href="/admin/users" className="text-blue-600 hover:underline">Manage Users</a></li>
        <li><a href="/admin/posts" className="text-blue-600 hover:underline">Manage Posts</a></li>
        <li><a href="/admin/comments" className="text-blue-600 hover:underline">Manage Comments</a></li>
      </ul>
    </div>
  );
}
