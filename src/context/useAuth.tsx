import React, { createContext, useContext, useEffect, useState } from 'react'
import { wxlogin } from '@/utils/wxlogin'
import Taro from '@tarojs/taro'
import { useAppDispatch } from '@/app/hooks'
import { clearUserProfile, setUserProfile } from '@/features/user'
import { getUserInfo } from '@/router/api'
import { wsSingleton } from '@/utils/wsSingleton'
import { ChatMessage } from '@/interface/webSocket'
import { pushMessage } from '@/features/chat'

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      setIsLoggedIn(true)

      return true
    } catch (err) {
      console.log('登录失败', err)
      return false
    }
  }
  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    wsSingleton.connect({
      url: `wss://testapi.helloworld-hdu.com/chat/`,
      headers: {
        Authorization: `Bearer ${Taro.getStorageSync('token')}`
      }
    })
    wsSingleton.subscribe('__mine__', (msg, sid) => {
      dispatch(pushMessage({ sessionId: sid!, msg: msg as ChatMessage }))
      wsSingleton.addChatSessions(sid!, 1)
    })
    return () => {
      wsSingleton.close()
    }
  }, [isLoggedIn])
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
