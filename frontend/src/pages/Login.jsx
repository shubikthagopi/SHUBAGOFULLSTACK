import React, { useState } from 'react';
import API from '../api';
export default function Login(){
  const [email,setEmail]=useState('admin@shubago'); const [password,setPassword]=useState('');
  async function submit(e){ e.preventDefault(); try{ const r = await API.post('/auth/login',{ email,password }); localStorage.setItem('shubago_token', r.data.token); window.location='/'; }catch(err){ alert('Login failed'); } }
  return (<div className='max-w-md'><h2 className='text-xl mb-4'>Login</h2>
    <form onSubmit={submit} className='space-y-2'>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' className='p-2 rounded w-full text-black' />
      <input value={password} onChange={e=>setPassword(e.target.value)} type='password' placeholder='password' className='p-2 rounded w-full text-black' />
      <button className='bg-blue-600 p-2 rounded text-white'>Login</button>
    </form>
  </div>)
}
