import { useState, useRef, useEffect, useMemo } from 'react'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setHistory, pushMessage } from '@/features/chat'
import { wsSingleton } from '@/utils/wsSingleton'
import { ChatMessage } from '@/interface/webSocket'
import ChatBox from '../../components/ChatBox'

export default function PrivateChat() {
  const dispatch = useAppDispatch()
  const senderInfo = useAppSelector((state) => state.user.profile)
  const receiverInfo = useAppSelector((state) => state.opposite)
  const sessionId = useMemo(
    () => `sessionId-${[senderInfo?.id, receiverInfo.id].sort().join('-')}`,
    [senderInfo, receiverInfo]
  )
  const testChatInfo = useAppSelector((state) => state.chat[sessionId])

  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<string>('')

  const startHeightBottom = Taro.getMenuButtonBoundingClientRect().bottom
  const startHeightTop = Taro.getMenuButtonBoundingClientRect().top
  // ✅ 订阅当前 session 的消息
  useEffect(() => {
    // 1. 先清空/初始化会话槽位
    wsSingleton.setChatSessions(sessionId, 0)
    console.log(wsSingleton.getChatSessions())
    dispatch(setHistory({ sessionId, list: [] }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLogic = (msg: any) => {
      const m = Array.isArray(msg) ? msg : [msg] // o
      console.log(m)
      m.forEach((v) =>
        dispatch(
          pushMessage({
            sessionId,
            msg: {
              eventType: 'chat',
              data: {
                sessionId: sessionId,
                from: v.from || 0,
                to: v.to || 0,
                avatar: v.avatar || '',
                name: v.name || '',
                time: v.time || 0,
                content: v.content || ''
              }
            }
          })
        )
      )
      console.log(testChatInfo)
    }
    wsSingleton.subscribe(sessionId, handleLogic)
    // 2. 订阅：把后续实时消息**追加**进去
    // 3. 拉历史（只一次）
    wsSingleton.send({ eventType: 'openChat' }, sessionId)
    return () => {
      wsSingleton.unsubscribe(sessionId)
      dispatch(setHistory({ sessionId, list: [] })) // 离开时也清空，防止残留
    }
  }, [sessionId, dispatch])
  const messages = useAppSelector((state) => state.chat[sessionId] || [])

  // ✅ 发送消息
  const handleSend = () => {
    if (!inputValue.trim()) return
    if (!senderInfo?.id || !receiverInfo?.id) {
      Taro.showToast({ title: '用户信息不完整', icon: 'none' })
      return
    }

    const msg: ChatMessage = {
      eventType: 'chat',
      data: {
        avatar: senderInfo.avatarUrl || '',
        name: senderInfo.name || '',
        from: senderInfo.id,
        to: receiverInfo.id,
        sessionId,
        content: inputValue.trim(),
        time: Date.now()
      }
    }

    wsSingleton.send(msg, sessionId)
    // 4. 本地追加
    dispatch(pushMessage({ sessionId, msg }))
    setInputValue('')
    scrollRef.current = `msg-${msg.data?.time}`
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
          <View className='text-sm text-white' onClick={() => Taro.navigateBack()}>
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
            <View key={message.data?.time} id={`msg-${message.data?.time}`}>
              <View className='mb-2 flex justify-center'>
                <Text className='text-xs text-gray-500'>
                  {new Date(message.data?.time || 0).toLocaleTimeString()}
                </Text>
              </View>
              <View
                className={`mb-4 flex items-end ${
                  message.data?.from === senderInfo?.id ? 'justify-end' : 'justify-start'
                }`}
                style={{ width: '100%' }}
              >
                {/* 对方头像 */}
                {message.data?.from !== senderInfo?.id && (
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
                    message.data?.from === senderInfo?.id ? 'items-end' : 'items-start'
                  }`}
                  style={{ maxWidth: 'calc(100% - 60px)' }}
                >
                  <ChatBox
                    user={message.data?.from === senderInfo?.id ? 'Sender' : 'Receiver'}
                    content={message.data?.content || ''}
                  />
                </View>

                {/* 我方头像 */}
                {message.data?.from === senderInfo?.id && (
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
