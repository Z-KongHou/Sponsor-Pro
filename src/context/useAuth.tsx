import React, { createContext, useContext, useEffect, useState } from 'react'
import { wxlogin } from '@/utils/wxlogin'
import Taro from '@tarojs/taro'
interface AuthContextType {
  isLoggedIn: boolean
  loading: boolean
  login: () => Promise<boolean>
  logout: () => void
}
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  login: async () => false,
  logout: () => {}
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = Taro.getStorageSync('token')
    const role = Taro.getStorageSync('role')
    if (token && role!="无") {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])
  const login = async () => {
    try {
      if (isLoggedIn) {
        return true
      }
      await wxlogin()
      setIsLoggedIn(true)
      return true
    } catch (err) {
      return false
    }
  }
  const logout = () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('role')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
