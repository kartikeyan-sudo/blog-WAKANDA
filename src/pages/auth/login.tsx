import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) setError('Invalid credentials');
    if (res?.ok) window.location.href = '/';
  };

  return (
    <>
      <Head>
        <title>Login | Wakanda Chronicles</title>
      </Head>
      
      <div className="min-h-screen bg-wakanda-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-futuristic font-bold text-wakanda-vibranium">
            Enter Wakanda Chronicles
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-wakanda-gray py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-wakanda-purple">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-wakanda-silver">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-wakanda-purple rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-wakanda-purple focus:border-wakanda-purple bg-wakanda-black text-wakanda-silver"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-wakanda-silver">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-wakanda-purple rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-wakanda-purple focus:border-wakanda-purple bg-wakanda-black text-wakanda-silver"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wakanda-purple hover:bg-wakanda-darkPurple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wakanda-purple"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-wakanda-purple"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-wakanda-gray text-wakanda-silver">Or</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/auth/register" className="font-medium text-wakanda-vibranium hover:text-wakanda-purple">
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
