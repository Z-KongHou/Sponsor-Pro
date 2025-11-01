import { useEffect } from 'react'
import { wsSingleton } from '@/utils/wsSingleton'
import { ChatMessage } from '@/interface/webSocket'

export function useChatChannel(
  chatId: string,
  onMessage: (msg: ChatMessage) => void
) {
  useEffect(() => {
    wsSingleton.subscribe(chatId, onMessage)
    return () => wsSingleton.unsubscribe(chatId, onMessage)
  }, [chatId, onMessage])
}
