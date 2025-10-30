import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import { AuthProvider } from '@/context/useAuth'
import { store } from './app/store'
import './app.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })
  // children 是将要会渲染的页面
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}

export default App
