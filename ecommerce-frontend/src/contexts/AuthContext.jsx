import React, { createContext, useState, useEffect } from 'react'
import api, { setAuthToken } from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch { return null }
  })

  useEffect(() => {
    const token = user?.token
    setAuthToken(token)
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data) {
        setUser(res.data)
        return res.data
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Une erreur est survenue lors de la connexion'
      throw new Error(message)
    }
  }

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData)
      if (res.data) {
        setUser(res.data)
        return res.data
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription'
      throw new Error(message)
    }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
