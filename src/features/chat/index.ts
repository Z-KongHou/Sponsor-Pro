// src/features/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatMessage } from '@/interface/webSocket'

type SessionMap = Record<string, ChatMessage[]> // key = sessionId

const initialState: SessionMap = {}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 推送一条实时消息（含 sessionId）
    pushMessage: (
      state,
      { payload }: PayloadAction<{ sessionId: string; msg: ChatMessage }>
    ) => {
      const { sessionId, msg } = payload
      if (!state[sessionId]) state[sessionId] = []
      state[sessionId].push(msg)
    },
    // 批量替换历史（openChat 用）
    setHistory: (
      state,
      { payload }: PayloadAction<{ sessionId: string; list: ChatMessage[] }>
    ) => {
      state[payload.sessionId] = payload.list
    },
    // 获取某会话的历史消息
    // 清空某会话
    clearSession: (state, { payload }: PayloadAction<{ sessionId: string }>) => {
      delete state[payload.sessionId]
    },
    // 全清（退出登录）
    clearAll: () => ({})
  }
})

export const { pushMessage, setHistory, clearSession, clearAll } = chatSlice.actions
export default chatSlice.reducer
