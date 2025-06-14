import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { title, content, categoryId } = req.body;
  if (!title || !content || !categoryId) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const slug = slugify(title);
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        authorId: user.id,
        categoryId,
        published: false,
      },
    });
    return res.status(201).json({ id: post.id });
  } catch (e) {
    console.error('Post creation error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
