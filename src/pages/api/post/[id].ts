import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing post id' });
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, title: true, content: true, author: { select: { name: true } }, createdAt: true },
  });
  if (!post || !post) return res.status(404).json({ error: 'Post not found' });
  return res.status(200).json({ post });
}
