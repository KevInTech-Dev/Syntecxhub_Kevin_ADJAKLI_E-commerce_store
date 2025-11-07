import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import CartContext from '../contexts/CartContext'

export default function Header() {
  const { user, logout } = useContext(AuthContext)
  const { items } = useContext(CartContext)

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to='/' className="text-2xl font-bold">
              Kev-Ecom
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link 
              to='/cart' 
              className="flex items-center space-x-1 hover:text-primary-100 transition-colors"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span className="font-medium">
                Cart ({items.length})
              </span>
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="font-medium">{user.name}</span>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-primary-700 rounded-md hover:bg-primary-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to='/login'
                className="px-4 py-2 bg-primary-700 rounded-md hover:bg-primary-800 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
