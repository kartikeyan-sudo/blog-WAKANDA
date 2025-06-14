import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  blocked: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role !== 'ADMIN') {
        window.location.href = '/';
      } else {
        fetch('/api/admin/users')
          .then(res => res.json())
          .then(data => {
            setUsers(data.users || []);
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to load users');
            setLoading(false);
          });
      }
    });
  }, []);

  const handleBlock = async (id: string, block: boolean) => {
    await fetch('/api/admin/users/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, block }),
    });
    setUsers(users => users.map(u => u.id === id ? { ...u, blocked: block } : u));
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setUsers(users => users.filter(u => u.id !== id));
  };

  const handleRole = async (id: string, role: string) => {
    await fetch('/api/admin/users/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    setUsers(users => users.map(u => u.id === id ? { ...u, role } : u));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Email</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Blocked</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">
                <select value={user.role} onChange={e => handleRole(user.id, e.target.value)} className="border rounded p-1">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="p-2">{user.blocked ? 'Yes' : 'No'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleBlock(user.id, !user.blocked)} className="px-2 py-1 bg-yellow-400 rounded">
                  {user.blocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
