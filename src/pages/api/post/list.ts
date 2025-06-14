import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, author: { select: { name: true } }, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.status(200).json({ posts });
}
