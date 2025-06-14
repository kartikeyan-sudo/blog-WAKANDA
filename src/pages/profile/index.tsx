import { getSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  posts: { id: string; title: string; published: boolean }[];
  comments: { id: string; content: string; post: { id: string; title: string } }[];
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updateMsg, setUpdateMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then(session => {
      if (!session) router.replace('/auth/login');
      else {
        fetch('/api/profile')
          .then(res => res.json())
          .then(data => {
            setProfile(data.profile || null);
            setNewName(data.profile?.name || '');
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to load profile');
            setLoading(false);
          });
      }
    });
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg('');
    const formData = new FormData();
    formData.append('name', newName);
    if (imageFile) formData.append('image', imageFile);
    const res = await fetch('/api/profile', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) setUpdateMsg(data.error || 'Update failed');
    else {
      setUpdateMsg('Profile updated!');
      setProfile(profile => profile ? { ...profile, name: newName, image: data.image || profile.image } : profile);
      setEditMode(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-center">Profile not found.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="mb-6 flex items-center gap-4">
        {profile.image && <img src={profile.image} alt="Profile" className="w-16 h-16 rounded-full" />}
        <div>
          {editMode ? (
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="border rounded p-1"
                required
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={e => setImageFile(e.target.files?.[0] || null)}
              />
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="text-gray-500">Cancel</button>
            </form>
          ) : (
            <>
              <div className="font-semibold">{profile.name}</div>
              <div className="text-gray-500 text-sm">{profile.email}</div>
              <button onClick={() => setEditMode(true)} className="mt-2 bg-gray-200 px-2 py-1 rounded">Edit Profile</button>
            </>
          )}
        </div>
      </div>
      {updateMsg && <div className="mb-4 text-green-600">{updateMsg}</div>}
      <h2 className="text-xl font-bold mt-8 mb-2">Your Posts</h2>
      <ul className="mb-8 space-y-2">
        {profile.posts.map(post => (
          <li key={post.id}>
            <a href={`/post/${post.id}`} className="text-blue-600 hover:underline">{post.title}</a>
            <span className="ml-2 text-xs text-gray-500">{post.published ? 'Published' : 'Draft'}</span>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-2">Your Comments</h2>
      <ul className="space-y-2">
        {profile.comments.map(comment => (
          <li key={comment.id}>
            <span className="text-gray-700">On <a href={`/post/${comment.post.id}`} className="text-blue-600 hover:underline">{comment.post.title}</a>:</span>
            <span className="ml-2">{comment.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
