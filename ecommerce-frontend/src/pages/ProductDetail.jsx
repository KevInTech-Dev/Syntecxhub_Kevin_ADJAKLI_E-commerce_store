import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import CartContext from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useContext(CartContext)

  useEffect(()=>{
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(console.error)
  },[id])

  if(!product) return <div>Loading...</div>

  const [qty, setQty] = useState(1)

  const handleAdd = () => {
    if (qty > product.countInStock) return toast.error('Quantité indisponible')
    addToCart(product, qty)
    toast.success('Ajouté au panier')
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img src={product.image} alt={product.name} className="w-full h-[480px] object-cover rounded-md" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <p className="text-2xl font-extrabold text-primary-600 mb-4">${product.price.toFixed(2)}</p>
        <p className="mb-4">En stock: <strong>{product.countInStock}</strong></p>

        <div className="mb-4">
          <label className="block mb-1">Quantité</label>
          <select className="input max-w-xs" value={qty} onChange={e=>setQty(Number(e.target.value))}>
            {Array.from({length: Math.min(product.countInStock, 10)}, (_,i)=>i+1).map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={handleAdd} className="btn-primary">Ajouter au panier</button>
        </div>
      </div>
    </div>
  )
}
