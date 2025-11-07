import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', countInStock: 0, category: '' })
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{ api.get('/products').then(r=>setProducts(r.data)).catch(console.error) },[])

  const create = async (e) => {
    e.preventDefault()
    try{
      const payload = { ...form, price: Number(form.price), countInStock: Number(form.countInStock) }
      const res = await api.post('/products', payload)
      setProducts(prev => [res.data, ...prev])
      setForm({ name: '', description: '', price: '', image: '', countInStock: 0, category: '' })
    }catch(err){ alert('Create failed') }
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if(!file) return
    const fd = new FormData()
    fd.append('image', file)
    try{
      setUploading(true)
      const res = await api.post('/products/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm(prev => ({ ...prev, image: res.data.imageUrl }))
    }catch(err){ alert('Upload failed') } finally { setUploading(false) }
  }

  const remove = async (id) => {
    if(!confirm('Delete product?')) return
    try{ await api.delete(`/products/${id}`); setProducts(prev => prev.filter(p=>p._id!==id)) }catch(err){ alert('Delete failed') }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin - Products</h2>
      <form onSubmit={create} className="space-y-3 mb-6">
        <input className="input" placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="input" placeholder='Price' value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input className="input" placeholder='Category' value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <input className="input" placeholder='Count in stock' value={form.countInStock} onChange={e=>setForm({...form,countInStock:e.target.value})} />
        <input className="input" placeholder='Image URL' value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
        <div>
          <label className="block mb-1">Upload image</label>
          <input type="file" onChange={handleFile} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
        <div>
          <button className="btn-primary" type='submit'>Create</button>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="card">
            <img src={p.image} className="w-full h-40 object-cover rounded-md mb-3" />
            <h4 className="font-semibold">{p.name}</h4>
            <p className="text-primary-600 font-bold mb-2">${p.price}</p>
            <div className="flex justify-between items-center">
              <button onClick={()=>remove(p._id)} className="px-3 py-1 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
