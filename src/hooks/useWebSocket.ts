import { useEffect, useState, useCallback } from 'react'
import {
  ensureConnected,
  subscribe,
  send,
  getStatus
} from '@/utils/wsSingleton'
import type { ChatMessage, SocketStatus } from '@/interface/webSocket'
import { useAppSelector } from '@/app/hooks'

export function useWebSocket() {
  const [status, setStatus] = useState<SocketStatus>(getStatus())
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // ✅ 在组件顶层获取用户ID，遵循Hook规则
  const receiverId = useAppSelector((state) => state.user.profile?.id)
  const senderId = useAppSelector((state) => state.opposite.id)

  // 1. 保证全局连接存在
  useEffect(() => {
    ensureConnected()
  }, [])

  // 2. 订阅原始消息，按 sessionId 过滤
  useEffect(() => {
    // ✅ 在useEffect内部计算sessionId，避免在回调中调用Hook
    const sessionId = `SessionId-${[receiverId, senderId].sort().join('')}`

    const unSub = subscribe((raw) => {
      try {
        const msg: ChatMessage = JSON.parse(raw)
        if (msg.sessionId === sessionId) {
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
  }, [receiverId, senderId]) // ✅ 添加依赖项

  // 3. 发送消息
  const sendMessage = useCallback(
    (content: string) => {
      const sessionId = `SessionId-${[receiverId, senderId].sort().join('')}`
      const msg: ChatMessage = {
        sessionId,
        from: senderId,
        time: Date.now(),
        content,
        type: 'text'
      }
      send(JSON.stringify(msg))
      setMessages((prev) => [...prev, msg].sort((a, b) => a.time - b.time))
    },
    [receiverId, senderId]
  ) // ✅ 添加依赖项

  // 4. 状态同步（可选，只读单例状态）
  useEffect(() => {
    const timer = setInterval(() => setStatus(getStatus()), 500)
    return () => clearInterval(timer)
  }, [])

  return { messages, sendMessage, status }
}
