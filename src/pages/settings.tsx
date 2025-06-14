import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

export default function SettingsPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getSession().then(session => {
      if (!session) window.location.href = '/auth/login';
      else {
        fetch('/api/settings').then(res => res.json()).then(data => {
          setEmail(data.email || '');
          setTheme(data.theme || 'light');
          setEmailNotifications(data.emailNotifications ?? true);
        });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, theme, emailNotifications }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || 'Update failed');
    else setMsg('Settings updated!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <label className="block mb-2">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded" required />
        <label className="block mb-2">New Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <label className="block mb-2">Theme</label>
        <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full mb-4 p-2 border rounded">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <label className="block mb-2">Email Notifications</label>
        <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-6">Update Settings</button>
        {msg && <div className="mt-4 text-green-600">{msg}</div>}
      </form>
    </div>
  );
}
