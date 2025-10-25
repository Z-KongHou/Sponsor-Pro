import { View, Text } from '@tarojs/components'

type User = 'Sender' | 'Receiver'

export default function ChatBox(user: User, content: string) {
  return (
    <View className='rounded-xl border border-gray-100 bg-white p-2 shadow-sm'>
      <Text>{content}</Text>
    </View>
  )
}
