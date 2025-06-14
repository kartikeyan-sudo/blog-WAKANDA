import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing post id' });
  if (req.method === 'GET') {
    const comments = await prisma.comment.findMany({
      where: { postId: id, blocked: false },
      select: { id: true, content: true, author: { select: { name: true } }, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json({ comments });
  }
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions as any);
    if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content' });
    const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const comment = await prisma.comment.create({
      data: { content, postId: id, authorId: user.id },
      select: { id: true, content: true, author: { select: { name: true } }, createdAt: true },
    });
    return res.status(201).json({ comment });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
