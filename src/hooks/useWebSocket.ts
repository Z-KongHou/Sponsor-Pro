import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ensureConnected,
  subscribe,
  send,
  getStatus
} from '@/utils/wsSingleton'
import type {
  UseChatSocketOptions,
  ChatMessage,
  SocketStatus
} from '@/interface/webSocket'

export function useWebSocket({ sessionId, userId }: UseChatSocketOptions) {
  const [status, setStatus] = useState<SocketStatus>(getStatus())
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const sessionIdRef = useRef(sessionId)
  const userIdRef = useRef(userId)

  // 实时同步最新会话/用户
  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])
  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  // 1. 保证全局连接存在
  useEffect(() => {
    ensureConnected()
  }, [])

  // 2. 订阅原始消息，按 sessionId 过滤
  useEffect(() => {
    const unSub = subscribe((raw) => {
      try {
        const msg: ChatMessage = JSON.parse(raw)
        if (msg.sessionId === sessionIdRef.current) {
          setMessages((prev) => {
            // 简单去重
            const exist = prev.some(
              (m) => m.time === msg.time && m.from === msg.from
            )
            return exist ? prev : [...prev, msg].sort((a, b) => a.time - b.time)
          })
        }
      } catch (e) {
        console.error('[ws] 解析失败', raw, e)
      }
    })
    return unSub
  }, [])

  // 3. 发送消息
  const sendMessage = useCallback((content: string) => {
    const msg: ChatMessage = {
      sessionId: sessionIdRef.current,
      from: userIdRef.current,
      time: Date.now(),
      content,
      type: 'text'
    }
    send(JSON.stringify(msg))
    setMessages((prev) => [...prev, msg].sort((a, b) => a.time - b.time))
  }, [])

  // 4. 状态同步（可选，只读单例状态）
  useEffect(() => {
    const timer = setInterval(() => setStatus(getStatus()), 500)
    return () => clearInterval(timer)
  }, [])

  return { messages, sendMessage, status }
}
