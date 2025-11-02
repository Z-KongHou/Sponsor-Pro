import Taro from '@tarojs/taro'
import { ChatMessage } from '@/interface/webSocket'
import { ChatItem } from '@/pages/chat/chat'

/** 每个 WebSocket 消息的通用回调 */
type WSCallback = (msg: ChatMessage | ChatMessage[], sessionId?: string) => void

/** 初始化事件：服务器下发所有会话 */
interface WSInitEvent {
  eventType: 'init'
  data: ChatItem[]
}

/** 打开某个会话时的历史消息 */
interface WSOpenChatEvent {
  eventType: 'openChat'
  data: { sessionId: string; messages: ChatMessage[] }
}

/** 实时聊天消息事件 */
interface WSChatEvent {
  eventType: 'chat'
  data: { sessionId: string; message: ChatMessage }
}

/** 统一的 WebSocket 事件类型 */
type WSEvent = WSInitEvent | WSOpenChatEvent | WSChatEvent

/** 单例类：用于 WebSocket 通信 */
class WSSingleton {
  private socketTask: Taro.SocketTask | null = null
  private listeners = new Map<string, WSCallback>() // 单订阅者：每个 sessionId 对应一个回调
  private isConnected = false
  private connecting = false
  private chatSessions: ChatItem[] = []

  /** 连接 WebSocket */
  async connect({ url, headers }: { url: string; headers: Record<string, string> }) {
    if (this.connecting || this.isConnected) return
    this.connecting = true

    try {
      const task = await Taro.connectSocket({ url, header: headers })
      this.socketTask = task

      task.onOpen(() => {
        console.log('✅ WebSocket 已连接')
        this.isConnected = true
        this.connecting = false
        wsSingleton.send({
          eventType: 'init'
        })
      })

      task.onClose(() => {
        console.log('⚠️ WebSocket 已关闭')
        this.isConnected = false
        this.connecting = false
      })

      task.onMessage((msg) => {
        console.log('✅ 收到消息:', msg.data)
        try {
          const data: WSEvent = JSON.parse(msg.data as string)

          switch (data.eventType) {
            /** 初始化会话列表 */
            case 'init': {
              this.chatSessions = data.data
              console.log('✅ 初始化会话列表:', this.chatSessions)
              break
            }

            /** 打开会话（历史消息） */
            case 'openChat': {
              const { sessionId, messages } = data.data
              const callback = this.listeners.get(sessionId)
              if (callback) callback(messages, sessionId)
              break
            }

            /** 收到实时消息 */
            case 'chat': {
              const { sessionId, message } = data.data
              const callback = this.listeners.get(sessionId)
              if (callback) callback(message, sessionId)
              break
            }

            default:
              console.warn('⚠️ 未知事件类型:', data)
          }
        } catch (err) {
          console.error('❌ WebSocket 消息解析错误:', err)
        }
      })
    } catch (err) {
      console.error('❌ WebSocket 连接失败:', err)
      this.connecting = false
    }
  }

  close() {
    this.socketTask?.close({
      code: 1000,
      reason: '正常关闭'
    })
  }
  /** 发送消息 */
  send(content: ChatMessage, sessionId?: string) {
    if (!this.isConnected || !this.socketTask) {
      console.warn('⚠️ WebSocket 未连接')
      return
    }
    const payload = JSON.stringify({ sessionId, content })
    this.socketTask.send({ data: payload })
    console.log('✅ 已发送消息:', payload)
  }

  /** 获取所有会话 */
  getChatSessions() {
    return this.chatSessions
  }

  /** 注册某个会话的监听 */
  subscribe(sessionId: string, callback: WSCallback) {
    this.listeners.set(sessionId, callback)
  }

  /** 取消某个会话监听 */
  unsubscribe(sessionId: string) {
    this.listeners.delete(sessionId)
  }
}

export const wsSingleton = new WSSingleton()
