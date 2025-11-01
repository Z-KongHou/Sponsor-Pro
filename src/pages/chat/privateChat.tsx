import { useState, useEffect, useRef } from 'react'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useWebSocket } from '@/hooks/useWebSocket'
import ChatBox from '../../components/ChatBox'

export default function PrivateChat() {
  const { messages, sendMessage, status } = useWebSocket()
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<string>('')

  const startHeightBottom = Taro.getMenuButtonBoundingClientRect().bottom
  const startHeightTop = Taro.getMenuButtonBoundingClientRect().top

  // 当有新消息时，更新滚动到最底部
  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current = `msg-${messages[messages.length - 1].time}`
    }
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage(inputValue.trim())
    setInputValue('')
  }

  return (
    <View
      className='flex min-h-screen w-full flex-col'
      style={{ backgroundColor: '#EDEDED' }}
    >
      {/* 顶部导航栏 */}
      <View
        className='flex flex-col bg-blue-500 px-4'
        style={{ height: startHeightBottom + 16 }}
      >
        <View style={{ height: startHeightTop, width: '100%' }}></View>
        <View className='flex items-start justify-between bg-blue-500 px-4'>
          <View
            className='text-sm text-white'
            onClick={() => Taro.navigateBack()}
          >
            {'<'}
          </View>
          <View className='text-base text-white'>私信聊天</View>
          <View className='w-8 text-xs text-white'>
            {status === 'open' ? '在线' : '连接中'}
          </View>
        </View>
      </View>

      {/* 聊天消息区域 */}
      <ScrollView
        className='box-border w-full flex-1'
        scrollY
        scrollIntoView={scrollRef.current}
      >
        <View className='w-full px-4 py-3'>
          {messages.map((message) => (
            <View key={message.time} id={`msg-${message.time}`}>
              <View className='mb-2 flex justify-center'>
                <Text className='text-xs text-gray-500'>
                  {new Date(message.time).toLocaleTimeString()}
                </Text>
              </View>
              <View
                className={`mb-4 flex items-end ${
                  message.from === message.sessionId.split('-')[1]
                    ? 'justify-end'
                    : 'justify-start'
                }`}
                style={{ width: '100%' }}
              >
                {message.from !== message.sessionId.split('-')[1] && (
                  <View className='mr-3 flex flex-shrink-0 flex-col items-center'>
                    <View
                      className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200'
                      style={{ backgroundColor: '#60A5FA' }}
                    >
                      <Text className='text-xs font-medium text-white'>对</Text>
                    </View>
                  </View>
                )}

                <View
                  className={`flex flex-col ${
                    message.from === message.sessionId.split('-')[1]
                      ? 'items-end'
                      : 'items-start'
                  }`}
                  style={{ maxWidth: 'calc(100% - 60px)' }}
                >
                  <ChatBox
                    user={
                      message.from === message.sessionId.split('-')[1]
                        ? 'Sender'
                        : 'Receiver'
                    }
                    content={message.content}
                  />
                </View>

                {message.from === message.sessionId.split('-')[1] && (
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
      <View className='flex items-center border-t border-gray-200 bg-white px-4 py-3'>
        <Input
          className='mr-3 flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm'
          placeholder='输入消息...'
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
          onConfirm={handleSend}
        />
        <Button
          className='rounded-full bg-blue-500 px-4 py-2 text-sm text-white'
          onClick={handleSend}
        >
          发送
        </Button>
      </View>
    </View>
  )
}
