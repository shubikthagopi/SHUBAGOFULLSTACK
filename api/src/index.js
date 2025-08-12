import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import invoiceRoutes from './routes/invoices.js';
import exportRoutes from './routes/export.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res)=> res.send({ ok:true, app:'SHUBAGO API' }));

app.use('/auth', authRoutes(prisma));
app.use('/products', productRoutes(prisma));
app.use('/invoices', invoiceRoutes(prisma));
app.use('/export', exportRoutes(prisma));

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('API listening on', port));
