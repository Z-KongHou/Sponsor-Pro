// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import sponsorInfoReducer from '@/features/sponsorInfo'
import userReducer from '@/features/user'
import oppositeReducer from '@/features/oppositeUser'
import chatReducer from '@/features/chat'

export const store = configureStore({
  reducer: {
    sponsorInfo: sponsorInfoReducer,
    user: userReducer,
    opposite: oppositeReducer,
    chat: chatReducer
  }
  // 如果想关 devTools 或加中间件可继续写
})

/* ===== 下面 3 行类型是全项目“通用钥匙” ===== */

// 1. 整个 state 树的类型
export type RootState = ReturnType<typeof store.getState>

// 2. dispatch 的类型（自动包含 thunk）
export type AppDispatch = typeof store.dispatch

// 3. store 本身的类型（偶尔用于测试）
export type AppStore = typeof store
