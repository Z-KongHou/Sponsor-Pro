import { useState } from 'react'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import ChatBox from '../../components/ChatBox'

interface Message {
  id: number
  user: 'Sender' | 'Receiver'
  content: string
  timestamp: string
}

export default function PrivateChat() {
  const [messageList] = useState<Message[]>([
    {
      id: 1,
      user: 'Sender',
      content: '你好，我对你们的赞助活动很感兴趣',
      timestamp: '14:30'
    },
    {
      id: 2,
      user: 'Receiver',
      content: '您好！欢迎咨询我们的赞助活动，请问有什么具体需求吗？',
      timestamp: '14:32'
    },
    {
      id: 3,
      user: 'Sender',
      content: '我们是一个校园社团，正在寻找合适的赞助商',
      timestamp: '14:35'
    },
    {
      id: 4,
      user: 'Receiver',
      content: '明白了，我们可以为您提供多种赞助方案',
      timestamp: '14:37'
    }
  ])

  const [inputValue, setInputValue] = useState('')
  const startHeightBottom = Taro.getMenuButtonBoundingClientRect().bottom
  const startHeightTop = Taro.getMenuButtonBoundingClientRect().top
  const handleSend = () => {
    if (inputValue.trim()) {
      // 这里可以添加发送消息的逻辑
      setInputValue('')
    }
  }

  const handleInputConfirm = () => {
    handleSend()
  }

  return (
    <View
      className='flex min-h-screen w-full flex-col'
      style={{ backgroundColor: '#EDEDED' }}
    >
      <View
        className='flex flex-col bg-blue-500 px-4'
        style={{ height: startHeightBottom + 16 }}
      >
        <View style={{ height: startHeightTop, width: '100%' }}></View>
        <View className='flex items-start justify-between bg-blue-500 px-4'>
          <View
            className='text-sm text-white'
            onClick={() => Taro.navigateBack()}
            style={{ backgroundColor: 'transparent', border: 0 }}
          >
            {'<'}
          </View>
          <View className='text-base text-white'>私信聊天</View>
          <View className='w-8'></View>
        </View>
      </View>

      {/* 聊天消息区域 */}
      <ScrollView
        className='box-border w-full flex-1'
        scrollY
        scrollIntoView={`msg-${messageList[messageList.length - 1]?.id}`}
      >
        <View className='w-full px-4 py-3'>
          {messageList.map((message) => (
            <View key={message.id}>
              {/* 时间显示 - 页面中间位置 */}
              <View className='mb-2 flex justify-center'>
                <Text className='text-xs text-gray-500'>
                  {message.timestamp}
                </Text>
              </View>
              <View
                id={`msg-${message.id}`}
                className={`mb-4 flex items-end ${
                  message.user === 'Sender' ? 'justify-end' : 'justify-start'
                }`}
                style={{ width: '100%' }}
              >
                {message.user === 'Receiver' && (
                  <View className='mr-3 flex flex-shrink-0 flex-col items-center'>
                    <View
                      className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200'
                      style={{ backgroundColor: '#60A5FA' }}
                      onClick={() =>
                        Taro.navigateTo({ url: '/pages/chat/receiverProfile' })
                      }
                    >
                      <Text className='text-xs font-medium text-white'>企</Text>
                    </View>
                  </View>
                )}

                <View
                  className={`flex flex-col ${
                    message.user === 'Sender' ? 'items-end' : 'items-start'
                  }`}
                  style={{ maxWidth: 'calc(100% - 60px)' }}
                >
                  <ChatBox user={message.user} content={message.content} />
                </View>

                {message.user === 'Sender' && (
                  <View className='ml-3 flex flex-shrink-0 flex-col items-center'>
                    <View
                      className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200'
                      style={{ backgroundColor: '#9CA3AF' }}
                    >
                      <Text className='text-xs font-medium text-white'>我</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 底部输入框 */}
      <View
        className='flex items-center border-t border-gray-200 bg-white px-4 py-3'
        style={{ backgroundColor: 'white' }}
      >
        <Input
          className='mr-3 flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm'
          placeholder='输入消息...'
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
          onConfirm={handleInputConfirm}
          style={{ backgroundColor: '#F3F4F6' }}
        />
        <Button
          className='rounded-full bg-blue-500 px-4 py-2 text-sm text-white'
          onClick={handleSend}
          style={{ backgroundColor: '#3B82F6' }}
        >
          发送
        </Button>
      </View>
    </View>
  )
}
