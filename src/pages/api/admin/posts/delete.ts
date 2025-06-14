import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || (session as any).user?.role !== 'ADMIN') return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing post id' });
  await prisma.post.delete({ where: { id } });
  return res.status(200).json({ message: 'Post deleted' });
}
