import React, { useEffect } from 'react'
import { useAuth } from '@/context/useAuth'
import Taro from '@tarojs/taro'

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      Taro.showToast({ 
        title: '请先登录或注册', 
        icon: 'none',
        duration: 2000
      })
      
      const timer = setTimeout(() => {
        Taro.navigateTo({url:"/pages/register/index"})
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return null
  }

  return children
}

export default RequireAuth
