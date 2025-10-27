import { View, Text } from '@tarojs/components'

type User = 'Sender' | 'Receiver'

interface ChatBoxProps {
  user: User
  content: string
}

export default function ChatBox({ user, content }: ChatBoxProps) {
  const align = user === 'Sender' ? 'text-right' : 'text-left'
  return (
    <View className={`rounded-xl border border-gray-100 bg-white p-2 shadow-sm ${align}`}>
      <Text>{content}</Text>
    </View>
  )
}
