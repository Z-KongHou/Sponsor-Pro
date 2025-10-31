export interface ChatMessage {
  sessionId: string
  from: string
  time: number
  content: string
  type?: 'text' | 'system' | 'ping'
}
export type SocketStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
export interface UseChatSocketOptions {
  sessionId: string
  userId: string
}
