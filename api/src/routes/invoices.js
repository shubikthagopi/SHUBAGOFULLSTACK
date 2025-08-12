import express from 'express';
import { format } from 'date-fns';
import puppeteer from 'puppeteer';

export default function(prisma){
  const router = express.Router();

  router.post('/', async (req,res)=>{
    const { customer, items } = req.body;
    if(!items || !Array.isArray(items)) return res.status(400).json({ error:'items required' });
    let subtotal = 0, tax = 0;
    const inv = await prisma.invoice.create({ data:{ customer, subtotal:0, tax:0, total:0 } });
    for(const it of items){
      const prod = await prisma.product.findUnique({ where:{ id: it.productId } });
      const price = Number(it.price || prod.price || 0);
      const gstPercent = Number(it.gst || 12);
      const lineTotal = price * it.qty;
      const lineGST = Math.round(lineTotal * (gstPercent/100));
      subtotal += lineTotal;
      tax += lineGST;
      await prisma.invoiceItem.create({ data:{ invoiceId: inv.id, productId: prod.id, qty: it.qty, price, gst: gstPercent } });
      await prisma.product.update({ where:{ id: prod.id }, data:{ stock: Math.max(0, prod.stock - it.qty) } });
    }
    const total = subtotal + tax;
    const updated = await prisma.invoice.update({ where:{ id: inv.id }, data:{ subtotal, tax, total } });
    res.json(updated);
  });

  router.get('/', async (req,res)=> {
    const invoices = await prisma.invoice.findMany({ include:{ items:true }, orderBy:{ createdAt:'desc' } });
    res.json(invoices);
  });

  router.get('/:id/print', async (req,res)=> {
    const id = req.params.id;
    const inv = await prisma.invoice.findUnique({ where:{ id }, include:{ items:{ include:{ product:true } } } });
    if(!inv) return res.status(404).send('Not found');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${inv.id}</title>
    <style>body{font-family:Arial;max-width:800px;margin:0 auto;padding:20px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd}</style></head>
    <body><h1>SHUBAGO Invoice</h1><p>Invoice: ${inv.id}</p><p>Date: ${format(inv.createdAt,'yyyy-MM-dd')}</p>
    <table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>GST%</th></tr></thead><tbody>
    ${inv.items.map(i=>`<tr><td>${i.product.name}</td><td>${i.qty}</td><td>${i.price}</td><td>${i.gst}</td></tr>`).join('')}
    </tbody></table><h3>Subtotal: ${inv.subtotal}</h3><h3>Tax: ${inv.tax}</h3><h2>Total: ${inv.total}</h2></body></html>`;
    res.send(html);
  });

  // PDF endpoint using puppeteer
  router.get('/:id/pdf', async (req,res)=>{
    const id = req.params.id;
    const inv = await prisma.invoice.findUnique({ where:{ id }, include:{ items:{ include:{ product:true } } } });
    if(!inv) return res.status(404).send('Not found');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${inv.id}</title>
    <style>body{font-family:Arial;max-width:800px;margin:0 auto;padding:20px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd}</style></head>
    <body><h1>SHUBAGO Invoice</h1><p>Invoice: ${inv.id}</p><p>Date: ${format(inv.createdAt,'yyyy-MM-dd')}</p>
    <table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>GST%</th></tr></thead><tbody>
    ${inv.items.map(i=>`<tr><td>${i.product.name}</td><td>${i.qty}</td><td>${i.price}</td><td>${i.gst}</td></tr>`).join('')}
    </tbody></table><h3>Subtotal: ${inv.subtotal}</h3><h3>Tax: ${inv.tax}</h3><h2>Total: ${inv.total}</h2></body></html>`;

    // launch puppeteer and render PDF
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${inv.id}.pdf`);
    res.send(pdf);
  });

  return router;
}
