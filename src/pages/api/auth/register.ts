import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, name, password } = req.body;
  if (!email || !name || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, name, password: hashed, role: 'USER' },
    });
    return res.status(201).json({ message: 'User registered' });
  } catch (e) {
    console.error('Registration error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
