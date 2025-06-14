import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Head from 'next/head';

interface Post {
  id: string;
  title: string;
  author: { name: string };
  createdAt: string;
}

export default function BlogHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSession().then(session => {
      if (!session) {
        router.replace('/auth/login');
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    fetch('/api/post/list')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, [authChecked]);

  if (!authChecked) return (
    <div className="min-h-screen bg-wakanda-black text-wakanda-silver flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-wakanda-purple border-r-transparent border-b-wakanda-purple border-l-transparent animate-spin mb-4"></div>
        <p className="text-wakanda-silver">Checking authentication...</p>
      </div>
    </div>
  );
  
  if (loading) return (
    <Layout title="Home">
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-wakanda-purple border-r-transparent border-b-wakanda-purple border-l-transparent animate-spin mb-4"></div>
          <p className="text-wakanda-silver">Loading posts...</p>
        </div>
      </div>
    </Layout>
  );
  
  if (error) return (
    <Layout title="Home">
      <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">Error</p>
        <p className="block sm:inline">{error}</p>
      </div>
    </Layout>
  );

  return (
    <Layout title="Home">
      <Head>
        <title>Wakanda Chronicles | Home</title>
      </Head>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-futuristic font-bold text-wakanda-vibranium">Latest Chronicles</h1>
          <Link 
            href="/post/create" 
            className="bg-wakanda-purple hover:bg-wakanda-darkPurple text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            New Post
          </Link>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-10 bg-wakanda-gray/20 rounded-lg border border-wakanda-purple/30">
            <p className="text-wakanda-silver text-lg">No posts yet. Be the first to share your chronicle!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`} className="group">
                <div className="bg-wakanda-gray rounded-lg overflow-hidden shadow-lg border border-wakanda-purple/30 hover:border-wakanda-purple transition-all duration-300">
                  <div className="h-40 bg-gradient-to-br from-wakanda-purple/20 to-wakanda-black flex items-center justify-center">
                    <span className="text-5xl opacity-10 group-hover:opacity-30 transition-opacity duration-300">W</span>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-wakanda-vibranium group-hover:text-wakanda-purple transition-colors duration-300">
                      {post.title}
                    </h2>
                    <div className="mt-2 text-wakanda-silver text-sm flex justify-between">
                      <span>{post.author?.name || 'Unknown'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
