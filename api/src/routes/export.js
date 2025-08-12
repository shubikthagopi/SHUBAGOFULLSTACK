import express from 'express';
import ExcelJS from 'exceljs';

export default function(prisma){
  const router = express.Router();

  router.get('/products/csv', async (req,res)=>{
    const products = await prisma.product.findMany();
    const csv = ['id,sku,name,price,cost,stock'].join('\n') + '\n' + products.map(p=>`${p.id},${p.sku},${p.name},${p.price},${p.cost},${p.stock}`).join('\n');
    res.setHeader('Content-Type','text/csv');
    res.setHeader('Content-Disposition','attachment; filename=products.csv');
    res.send(csv);
  });

  router.get('/products/xlsx', async (req,res)=>{
    const products = await prisma.product.findMany();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Products');
    sheet.addRow(['id','sku','name','price','cost','stock']);
    products.forEach(p=> sheet.addRow([p.id,p.sku,p.name,p.price,p.cost,p.stock]));
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition','attachment; filename=products.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  });

  return router;
}
