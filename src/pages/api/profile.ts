import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions as any);
    if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Parse form data
    const formidable = require('formidable');
    const { supabase } = require('../../utils/supabase');
    const form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) return res.status(400).json({ error: 'Invalid form data' });
      const name = fields.name;
      let imageUrl = user.image;
      if (files.image) {
        const file = files.image;
        const fileData = require('fs').readFileSync(file.filepath);
        const { data, error } = await supabase.storage.from('profile-pics').upload(`${user.id}/${file.originalFilename}`, fileData, { upsert: true });
        if (error) return res.status(500).json({ error: 'Image upload failed' });
        const { data: publicUrl } = supabase.storage.from('profile-pics').getPublicUrl(`${user.id}/${file.originalFilename}`);
        imageUrl = publicUrl.publicUrl;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { name, image: imageUrl },
      });
      return res.status(200).json({ image: imageUrl });
    });
    return;
  }

  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !(session as any).user?.email) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({
    where: { email: (session as any).user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      posts: { select: { id: true, title: true, published: true } },
      comments: { select: { id: true, content: true, post: { select: { id: true, title: true } } } },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json({ profile: user });
}
