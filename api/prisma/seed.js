import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function seed(){
  console.log('Seeding database...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shubago';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hash = bcrypt.hashSync(adminPassword, 10);
  const existing = await prisma.user.findUnique({ where:{ email: adminEmail }});
  if(!existing){
    await prisma.user.create({ data:{ email: adminEmail, password: hash, role:'ADMIN', name:'Admin' }});
    console.log('Created admin user:', adminEmail);
  } else {
    console.log('Admin already exists');
  }

  // sample products
  const p = await prisma.product.findFirst();
  if(!p){
    const products = [
      { sku:'PARA500', name:'Paracetamol 500mg', price:25, cost:12, stock:100 },
      { sku:'AZI500', name:'Azithromycin 500mg', price:120, cost:60, stock:50 },
      { sku:'CRO100', name:'Cough Syrup 100ml', price:90, cost:45, stock:30 }
    ];
    for(const prod of products) await prisma.product.create({ data: prod });
    console.log('Created sample products');
  } else {
    console.log('Products already seeded');
  }
  await prisma.$disconnect();
}

seed().catch(e=>{ console.error(e); process.exit(1); });
