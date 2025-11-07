import React, { useEffect, useState } from 'react'
import api from '../api'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')

  const fetchProducts = async () => {
    try{
      const params = {}
      if(search) params.search = search
      if(category) params.category = category
      if(sort) params.sort = sort
      const res = await api.get('/products', { params })
      setProducts(res.data)
    }catch(err){ console.error(err) }
  }

  useEffect(()=>{ fetchProducts() },[])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
        <div className="flex space-x-4 items-center">
          <input
            placeholder="Search"
            className="input max-w-md"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            onKeyDown={e=> { if(e.key==='Enter') fetchProducts() }}
          />
          <select className="input max-w-xs" value={sort} onChange={e=>{ setSort(e.target.value); fetchProducts() }}>
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <select className="input max-w-xs" value={category} onChange={e=>{ setCategory(e.target.value); fetchProducts() }}>
            <option value="">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
          </select>
          <button className="btn-primary" onClick={fetchProducts}>Filter</button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Aucun produit pour le moment.</h2>
            <p className="text-gray-500">Les produits apparaîtront ici une fois qu'ils seront ajoutés par l'administrateur.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}
