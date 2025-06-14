import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing post id' });
  if (req.method === 'GET') {
    let liked = false;
    let userId = null;
    const session = await getServerSession(req, res, authOptions as any);
    if (session && (session as any).user?.email) {
      const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
      if (user) {
        userId = user.id;
        liked = !!(await prisma.like.findFirst({ where: { postId: id, userId } }));
      }
    }
    const count = await prisma.like.count({ where: { postId: id } });
    return res.status(200).json({ count, liked });
  }
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions as any);
    if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const existing = await prisma.like.findFirst({ where: { postId: id, userId: user.id } });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
    } else {
      await prisma.like.create({ data: { postId: id, userId: user.id } });
    }
    const count = await prisma.like.count({ where: { postId: id } });
    const liked = !existing;
    return res.status(200).json({ count, liked });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
