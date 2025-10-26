// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// ① 类型安全的 dispatch → 能直接 dispatch(thunk)
export const useAppDispatch = () => useDispatch<AppDispatch>()

// ② 类型安全的 selector → 自动推断返回类型，不用再写 RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
