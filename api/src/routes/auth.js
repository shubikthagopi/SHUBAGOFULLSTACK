import express from 'express';
import { hashPassword, comparePassword, sign } from '../lib/auth.js';

export default function(prisma){
  const router = express.Router();

  router.post('/register', async (req,res)=>{
    const { email, password, name, role } = req.body;
    if(!email || !password) return res.status(400).json({ error:'email & password required' });
    const existing = await prisma.user.findUnique({ where:{ email } });
    if(existing) return res.status(400).json({ error:'Email exists' });
    const user = await prisma.user.create({ data:{ email, password: hashPassword(password), name, role: role||'CASHIER' } });
    const token = sign(user);
    res.json({ user:{ id:user.id, email:user.email, role:user.role, name:user.name }, token });
  });

  router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error:'email & password required' });
    const user = await prisma.user.findUnique({ where:{ email } });
    if(!user) return res.status(400).json({ error:'Invalid credentials' });
    if(!comparePassword(password, user.password)) return res.status(400).json({ error:'Invalid credentials' });
    const token = sign(user);
    res.json({ user:{ id:user.id, email:user.email, role:user.role, name:user.name }, token });
  });

  return router;
}
