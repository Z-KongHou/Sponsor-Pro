import React, { createContext, useContext, useEffect, useState } from 'react'
import { wxlogin } from '@/utils/wxlogin'
import Taro from '@tarojs/taro'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => Promise<boolean>
  logout: () => void
}
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => false,
  logout: () => {}
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    login()
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
      console.log('登录失败', err)
      return false
    }
  }
  const logout = () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('role')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
