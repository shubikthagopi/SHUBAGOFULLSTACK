import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Invoices from './pages/Invoices'
import Login from './pages/Login'

export default function App(){
  const token = localStorage.getItem('shubago_token');
  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <header className='flex justify-between mb-6'>
        <h1 className='text-2xl font-bold'>SHUBAGO</h1>
        <nav className='space-x-4'>
          <Link to='/'>Dashboard</Link>
          <Link to='/products'>Products</Link>
          <Link to='/invoices'>Invoices</Link>
          {!token ? <Link to='/login'>Login</Link> : <button onClick={()=>{ localStorage.removeItem('shubago_token'); window.location='/login'; }}>Logout</button>}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/invoices" element={<Invoices/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
