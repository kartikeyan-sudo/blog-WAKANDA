import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || (session as any).user?.role !== 'ADMIN') return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, published: true, author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return res.status(200).json({ posts });
}
