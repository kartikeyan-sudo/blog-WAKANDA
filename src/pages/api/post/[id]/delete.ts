import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing post id' });
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
  if (!user || post.authorId !== user.id) return res.status(403).json({ error: 'Forbidden' });
  await prisma.post.delete({ where: { id } });
  return res.status(200).json({ message: 'Post deleted' });
}
