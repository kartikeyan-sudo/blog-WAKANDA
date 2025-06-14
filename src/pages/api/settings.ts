import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (req.method === 'GET') {
    const settings = await prisma.userSettings.findUnique({ where: { userId: user.id } });
    return res.status(200).json({
      email: user.email,
      theme: settings?.theme || 'light',
      emailNotifications: settings?.emailNotifications ?? true,
    });
  }

  if (req.method === 'POST') {
    const { email, password, theme, emailNotifications } = req.body;
    if (email && email !== user.email) {
      await prisma.user.update({ where: { id: user.id }, data: { email } });
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    }
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { theme, emailNotifications },
      create: { userId: user.id, theme, emailNotifications },
    });
    return res.status(200).json({ message: 'Settings updated' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
