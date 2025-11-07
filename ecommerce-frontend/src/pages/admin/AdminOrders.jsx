import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminOrders(){
  const [orders, setOrders] = useState([])

  useEffect(()=>{ api.get('/orders').then(r=>setOrders(r.data)).catch(console.error) },[])

  const deliver = async (id) => {
    try{ await api.put(`/orders/${id}/deliver`); setOrders(prev => prev.map(o => o._id===id ? { ...o, isDelivered: true } : o)) }catch(err){ alert('Failed') }
  }

  return (
    <div>
      <h2>Admin - Orders</h2>
      {orders.map(o => (
        <div key={o._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom:8 }}>
          <p><strong>{o._id}</strong> by {o.user?.name} - ${o.totalPrice}</p>
          <p>Paid: {o.isPaid ? 'Yes' : 'No'} | Delivered: {o.isDelivered ? 'Yes' : 'No'}</p>
          {!o.isDelivered && <button onClick={()=>deliver(o._id)}>Mark delivered</button>}
        </div>
      ))}
    </div>
  )
}
