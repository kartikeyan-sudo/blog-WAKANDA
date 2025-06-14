import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Blog' }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>{title} | Wakanda Chronicles</title>
        <meta name="description" content="Wakanda Chronicles - A Black Panther themed blog" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" />
      </Head>

      <div className="min-h-screen flex flex-col bg-wakanda-black text-wakanda-silver">
        {/* Navbar */}
        <header className="bg-gradient-to-r from-wakanda-black to-wakanda-darkPurple border-b border-wakanda-purple">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-futuristic font-bold text-white">
              <span className="text-wakanda-purple">W</span>akanda <span className="text-wakanda-purple">C</span>hronicles
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                Home
              </Link>
              
              {session ? (
                <>
                  <Link href="/post/create" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                    Create Post
                  </Link>
                  <Link href="/profile" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                    Profile
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="bg-wakanda-purple hover:bg-wakanda-darkPurple text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="bg-wakanda-purple hover:bg-wakanda-darkPurple text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="border border-wakanda-purple hover:bg-wakanda-purple text-wakanda-silver hover:text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-wakanda-black to-wakanda-darkPurple border-t border-wakanda-purple py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-wakanda-silver">
              &copy; {new Date().getFullYear()} Wakanda Chronicles. All rights reserved.
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link href="/about" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-wakanda-silver hover:text-wakanda-vibranium transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
