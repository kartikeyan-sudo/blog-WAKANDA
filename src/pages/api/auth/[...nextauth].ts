import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../utils/prisma';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';

// Extend the session and token types to include role
import type { Session, User } from 'next-auth';
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof (user as any).role === 'string') {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export default handler;
