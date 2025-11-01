export interface ChatMessage {
  sessionId: string
  from: number
  time: number
  content: string
  type?: 'text' | 'system' | 'ping'
}
export type SocketStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
