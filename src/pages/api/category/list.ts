import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  return res.status(200).json({ categories });
}
