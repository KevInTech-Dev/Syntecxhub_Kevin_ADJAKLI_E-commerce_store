import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div className="card group">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
          <img 
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary-600">${(product.price ?? 0).toFixed(2)}</p>
          <button className="btn-primary">
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  )
}
