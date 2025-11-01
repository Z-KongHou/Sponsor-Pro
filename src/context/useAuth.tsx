import React, { createContext, useContext, useEffect, useState } from 'react'
import { wxlogin } from '@/utils/wxlogin'
import Taro from '@tarojs/taro'
import { useAppDispatch } from '@/app/hooks'
import { clearUserProfile, setUserProfile } from '@/features/user'
import { getUserInfo } from '@/router/api'

interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  login: () => Promise<boolean>
  logout: () => void
}
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  login: async () => false,
  logout: () => {}
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dispatch = useAppDispatch()
  useEffect(() => {
    login()
  }, [])
  const login = async () => {
    try {
      if (isLoggedIn) {
        return true
      }
      await wxlogin()
      const userInfo = await getUserInfo()
      dispatch(setUserProfile(userInfo.user))
      console.log(1)
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
    dispatch(clearUserProfile())
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
