import Taro from '@tarojs/taro'
import { ChatMessage } from '@/interface/webSocket'

class WSSingleton {
  private socketTask: Taro.SocketTask | null = null
  private listeners = new Map<string, Set<(msg: ChatMessage) => void>>()
  private isConnected = false
  private connecting = false

  async connect(url: string) {
    if (this.connecting || this.isConnected) {
      console.warn('WebSocket 已连接或正在连接中')
      return
    }

    this.connecting = true
    try {
      const task = await Taro.connectSocket({ url })
      this.socketTask = task

      task.onOpen(() => {
        console.log('✅ WebSocket 已连接')
        this.isConnected = true
        this.connecting = false
      })

      task.onError((err) => {
        console.error('❌ WebSocket 连接错误:', err)
        this.isConnected = false
        this.connecting = false
      })

      task.onClose(() => {
        console.log('⚠️ WebSocket 已关闭')
        this.isConnected = false
        this.connecting = false
        this.socketTask = null
      })

      task.onMessage((msg) => {
        try {
          const data = JSON.parse(msg.data as string)
          const { chatId, content } = data
          const subs = this.listeners.get(chatId)
          if (subs) subs.forEach((fn) => fn(content))
        } catch (e) {
          console.error('消息解析错误:', e)
        }
      })
    } catch (err) {
      console.error('WebSocket 连接失败:', err)
      this.connecting = false
    }
  }

  send(chatId: string, content: ChatMessage) {
    if (!this.isConnected || !this.socketTask) {
      console.warn('WebSocket 未连接，消息未发送')
      return
    }

    const payload = JSON.stringify({ chatId, content })
    this.socketTask.send({
      data: payload,
      fail: (err) => console.error('消息发送失败:', err)
    })
  }

  subscribe(chatId: string, callback: (msg: ChatMessage) => void) {
    if (!this.listeners.has(chatId)) this.listeners.set(chatId, new Set())
    this.listeners.get(chatId)!.add(callback)
  }

  unsubscribe(chatId: string, callback: (msg: ChatMessage) => void) {
    this.listeners.get(chatId)?.delete(callback)
  }
}

export const wsSingleton = new WSSingleton()
