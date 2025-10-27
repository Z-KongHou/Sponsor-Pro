import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { AuthProvider } from "@/context/useAuth"
import './app.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })
  // children 是将要会渲染的页面
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export default App
