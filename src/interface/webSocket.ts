export interface ChatMessage {
  eventType: 'chat' | 'openChat' | 'init'
  data?: {
    sessionId: string
    from: number
    to: number
    avatar: string
    name: string
    time: number
    content: string
    type?: 'text' | 'system' | 'ping'
  }
}
export type SocketStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
