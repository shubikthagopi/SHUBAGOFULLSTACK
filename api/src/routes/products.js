import express from 'express';
const router = express.Router();
export default function(prisma){
  router.get('/', async (req,res)=> {
    const q = req.query.q || '';
    const products = await prisma.product.findMany({ where: { OR: [{ name: { contains: q } }, { sku: { contains: q } }] } });
    res.json(products);
  });

  router.post('/', async (req,res)=> {
    const data = req.body;
    const p = await prisma.product.create({ data });
    res.json(p);
  });

  router.put('/:id', async (req,res)=>{
    const id = req.params.id; const data = req.body;
    const p = await prisma.product.update({ where:{ id }, data });
    res.json(p);
  });

  return router;
}
