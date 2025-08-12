import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function hashPassword(p){ return bcrypt.hashSync(p, 10); }
export function comparePassword(p, hash){ return bcrypt.compareSync(p, hash); }

export function sign(user){ return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); }
export function verify(token){ return jwt.verify(token, process.env.JWT_SECRET); }

export function requireAuth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error:'Missing auth' });
  const token = header.split(' ')[1];
  try{ req.user = verify(token); next(); }catch(e){ return res.status(401).json({ error:'Invalid token' }); }
}

export function requireRole(role){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ error:'Unauthorized' });
    if(req.user.role !== role && req.user.role !== 'ADMIN') return res.status(403).json({ error:'Forbidden' });
    next();
  };
}
