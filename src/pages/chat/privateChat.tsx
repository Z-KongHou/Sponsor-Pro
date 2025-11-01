import { useState, useRef, useEffect, useMemo } from 'react'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppSelector } from '@/app/hooks'
import { wsSingleton } from '@/utils/wsSingleton'
import { ChatMessage } from '@/interface/webSocket'
import ChatBox from '../../components/ChatBox'

export default function PrivateChat() {
  const senderId = useAppSelector((state) => state.user.profile?.id)
  const receiverInfo = useAppSelector((state) => state.opposite)
  const sessionId = useMemo(
    () => `sessionId-${[senderId, receiverInfo.id].sort().join('-')}`,
    [senderId, receiverInfo]
  )

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<string>('')

  const startHeightBottom = Taro.getMenuButtonBoundingClientRect().bottom
  const startHeightTop = Taro.getMenuButtonBoundingClientRect().top

  // ✅ 初始化连接
  useEffect(() => {
    wsSingleton.connect('wss://testapi.helloworld-hdu.com/ws/chat/')
  }, [])

  // ✅ 订阅当前 session 的消息
  useEffect(() => {
    const handleMsg = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg])
      scrollRef.current = `msg-${msg.time}`
    }

    wsSingleton.subscribe(sessionId, handleMsg)
    return () => {
      wsSingleton.unsubscribe(sessionId, handleMsg)
    }
  }, [sessionId])

  // ✅ 发送消息
  const handleSend = () => {
    if (!inputValue.trim()) return
    if (!senderId || !receiverInfo?.id) {
      Taro.showToast({ title: '用户信息不完整', icon: 'none' })
      return
    }

    const msg: ChatMessage = {
      from: senderId,
      sessionId,
      content: inputValue.trim(),
      time: Date.now()
    }

    wsSingleton.send(sessionId, msg)
    setMessages((prev) => [...prev, msg]) // 本地立即显示
    setInputValue('')
    scrollRef.current = `msg-${msg.time}`
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
          <View className='text-base text-white'>{receiverInfo.name}</View>
          <View className='w-8 text-xs text-white'></View>
        </View>
      </View>

      {/* 聊天消息区域 */}
      <ScrollView
        className='box-border w-full flex-1'
        scrollY
        scrollIntoView={scrollRef.current}
        scrollWithAnimation
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
                  message.from === senderId ? 'justify-end' : 'justify-start'
                }`}
                style={{ width: '100%' }}
              >
                {/* 对方头像 */}
                {message.from !== senderId && (
                  <View className='mr-3 flex flex-shrink-0 flex-col items-center'>
                    <View
                      className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200'
                      style={{ backgroundColor: '#60A5FA' }}
                    >
                      <Text className='text-xs font-medium text-white'>对</Text>
                    </View>
                  </View>
                )}

                {/* 聊天内容 */}
                <View
                  className={`flex flex-col ${
                    message.from === senderId ? 'items-end' : 'items-start'
                  }`}
                  style={{ maxWidth: 'calc(100% - 60px)' }}
                >
                  <ChatBox
                    user={message.from === senderId ? 'Sender' : 'Receiver'}
                    content={message.content}
                  />
                </View>

                {/* 我方头像 */}
                {message.from === senderId && (
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
