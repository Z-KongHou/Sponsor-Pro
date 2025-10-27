import { View, Text } from '@tarojs/components'

type User = 'Sender' | 'Receiver'

interface ChatBoxProps {
  user: User
  content: string
}

export default function ChatBox(props: ChatBoxProps) {
  return (
    <View
      className='max-w-xs rounded-xl border border-gray-100 p-3 shadow-sm'
      style={{
        backgroundColor: props.user === 'Sender' ? '#3B82F6' : 'white',
        color: props.user === 'Sender' ? 'white' : '#374151',
        borderColor: props.user === 'Sender' ? '#3B82F6' : '#E5E7EB'
      }}
    >
      <Text className='text-sm leading-relaxed'>{props.content}</Text>
    </View>
  )
}
