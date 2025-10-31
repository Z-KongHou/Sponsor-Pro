import Taro from '@tarojs/taro'
import { getUserIdForWs } from '@/features/common'

type RawHandler = (data: string) => void

let task: Taro.SocketTask | null = null
let globalStatus: 'idle' | 'connecting' | 'open' | 'closed' | 'error' = 'idle'
const handlers = new Set<RawHandler>()

/* 对外只暴露「原始消息」订阅 */
export const subscribe = (fn: RawHandler) => {
  handlers.add(fn)
  return () => {
    handlers.delete(fn)
  }
}

/* 发送任意字符串 */
export const send = (str: string) => {
  if (globalStatus === 'open' && task) {
    const { receiverId, senderId } = getUserIdForWs()
    if (!receiverId || !senderId) return
    const frame = {
      receiverId,
      token: Taro.getStorageSync('token'),
      type: 'text',
      sessionId: `SessionId-${[receiverId, senderId].sort().join('')}`,
      content: str
    }
    Taro.sendSocketMessage({
      data: JSON.stringify(frame)
    })
  } else {
    console.warn('[ws-singleton] 未连接，消息丢弃')
  }
}

/* 首次调用时创建唯一连接 */
export const ensureConnected = async () => {
  if (task) return // 已创建
  globalStatus = 'connecting'
  try {
    task = await Taro.connectSocket({
      url: `wss://${process.env.TARO_APP_DOMAIN}/ws`
    })
    task.onOpen(() => {
      globalStatus = 'open'
    })
    task.onClose(() => {
      globalStatus = 'closed'
      task = null
    })
    task.onError(() => {
      globalStatus = 'error'
      task = null
    })
    task.onMessage(({ data }) => {
      if (typeof data !== 'string') return
      handlers.forEach((fn) => fn(data))
    })
  } catch (e) {
    globalStatus = 'error'
    task = null
    console.error('[ws-singleton] 连接失败', e)
  }
}

/* 读当前状态 */
export const getStatus = () => globalStatus
