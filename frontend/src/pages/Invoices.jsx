import React, {useEffect, useState} from 'react';
import API from '../api';

export default function Invoices(){
  const [invoices,setInvoices] = useState([]);
  useEffect(()=>{ API.get('/invoices').then(r=>setInvoices(r.data)).catch(()=>{}); },[]);
  return (<div><h2 className='text-xl mb-4'>Invoices</h2>
    <ul>{invoices.map(i=>(<li key={i.id}>{i.id} — {i.total} — <a href={`http://localhost:4000/invoices/${i.id}/print`} target='_blank'>Print</a> — <a href={`http://localhost:4000/invoices/${i.id}/pdf`}>PDF</a></li>))}</ul>
  </div>)
}
