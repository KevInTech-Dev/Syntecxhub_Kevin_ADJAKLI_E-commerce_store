import React, { useContext } from 'react'
import CartContext from '../contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CartPage(){
  const { items, updateQuantity, removeItem } = useContext(CartContext)
  const navigate = useNavigate()

  const total = items.reduce((s,i)=> s + i.price * i.quantity, 0)

  const handleQty = (productId, qty) => {
    if (qty < 1) return
    updateQuantity(productId, qty)
  }

  if(items.length === 0) return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
      <p>Votre panier est vide. <Link to='/' className="text-primary-600">Retourner aux achats</Link></p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Votre panier</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map(i => (
            <div key={i.product} className="flex items-center gap-4 card">
              <img src={i.image} alt={i.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-1">
                <h4 className="font-semibold">{i.name}</h4>
                <p className="text-sm text-gray-600">${i.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <input type='number' className="input w-20" value={i.quantity} min={1} onChange={(e)=> handleQty(i.product, Number(e.target.value))} />
                  <button onClick={()=>{ removeItem(i.product); toast('Produit supprimé') }} className="px-3 py-1 bg-red-600 text-white rounded-md">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card">
          <h3 className="text-lg font-bold mb-3">Résumé de la commande</h3>
          <p className="mb-2">Articles: <strong>{items.length}</strong></p>
          <p className="mb-4 text-xl font-bold">Total: ${total.toFixed(2)}</p>
          <button onClick={()=> navigate('/checkout')} className="btn-primary w-full">Procéder au paiement</button>
        </aside>
      </div>
    </div>
  )
}
