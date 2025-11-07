import React, { useContext, useState } from 'react'
import CartContext from '../contexts/CartContext'
import AuthContext from '../contexts/AuthContext'
import api from '../api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const { items, clear } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' })
  const navigate = useNavigate()

  const total = items.reduce((s,i)=> s + i.price * i.quantity, 0)

  const handleCheckout = async () => {
    if (!user) { toast.error('Veuillez vous connecter'); return navigate('/login') }
    if (items.length === 0) { toast.error('Votre panier est vide'); return }
    setLoading(true)
    try{
      const payload = { cartItems: items, shippingAddress: address }
      const res = await api.post('/payment/create-checkout-session', payload)
      if (res.data?.url) {
        window.location.href = res.data.url
      } else {
        toast.error('Erreur lors de la création de la session de paiement')
      }
    }catch(err){
      console.error(err)
      toast.error('Erreur lors du paiement')
    }finally{setLoading(false)}
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paiement</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-3">Adresse de livraison</h3>
          <input className="input mb-2" placeholder="Adresse" value={address.address} onChange={e=>setAddress({...address,address:e.target.value})} />
          <input className="input mb-2" placeholder="Ville" value={address.city} onChange={e=>setAddress({...address,city:e.target.value})} />
          <input className="input mb-2" placeholder="Code postal" value={address.postalCode} onChange={e=>setAddress({...address,postalCode:e.target.value})} />
          <input className="input mb-2" placeholder="Pays" value={address.country} onChange={e=>setAddress({...address,country:e.target.value})} />
        </div>
        <aside className="card">
          <h3 className="font-semibold mb-3">Récapitulatif</h3>
          <p>Articles: <strong>{items.length}</strong></p>
          <p className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</p>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full">{loading ? 'Redirection...' : 'Payer avec Stripe'}</button>
        </aside>
      </div>
    </div>
  )
}
