import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import TabBar from '@/components/TabBar'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setUserInfo } from '@/features/oppositeUser'
import { wsSingleton } from '@/utils/wsSingleton'

export interface ChatItem {
  sessionId: string
  id: number
  name: string
  avatar?: string
  lastMessage: string
  lastTime: string
  unreadCount: number
}

export default function Chat() {
  // 模拟对话列表数据
  const [chatList, setChatList] = useState<ChatItem[]>([])
  const userInfo = useAppSelector((state) => state.opposite)

  useEffect(() => {
    setChatList(wsSingleton.getChatSessions())
  }, [])

  const dispatch = useAppDispatch()
  // 处理聊天项点击事件
  const handleChatItemClick = (chatItem: ChatItem) => {
    // 先设置接收方信息
    dispatch(
      setUserInfo({
        id: chatItem.id,
        name: chatItem.name,
        avatarUrl: chatItem.avatar || ''
      })
    )

    console.log(userInfo)
    Taro.navigateTo({
      url: `/pages/chat/privateChat`
    })
  }

  // 格式化时间显示
  const formatTime = (time: string) => {
    return time
  }
  const startHeight = Taro.getMenuButtonBoundingClientRect().bottom

  return (
    <View className='flex min-h-screen w-full flex-col bg-[#F5F7FA]'>
      {/* 顶部导航栏 */}
      <View
        className='sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 shadow-md'
        style={{ height: `${startHeight + 16}px` }}
      >
        <View className='flex h-full items-center justify-start text-xl font-semibold text-white'>
          消息
        </View>
      </View>

      {/* 搜索栏 */}
      <View className='bg-white px-4 py-3 shadow-sm'>
        <View className='flex items-center rounded-full bg-gray-100 px-4 py-2'>
          <Text className='ml-2 text-gray-500'>搜索</Text>
        </View>
      </View>

      {/* 对话列表 */}
      <ScrollView className='flex-1 bg-white' scrollY>
        {chatList.map((chatItem) => (
          <View
            key={chatItem.id}
            className='flex flex-row items-center border-b border-gray-100 px-4 py-3 transition-colors duration-200 hover:bg-gray-50 active:bg-blue-50'
            onClick={() => handleChatItemClick(chatItem)}
          >
            {/* 头像区域 */}
            <View className='relative mr-3'>
              <Image
                src={chatItem.avatar || ''}
                className='h-12 w-12 rounded-full border-2 border-white shadow-sm'
              />
              {/* 未读消息红点 */}
              {chatItem.unreadCount > 0 && (
                <View className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500'>
                  <Text className='text-xs text-white'>
                    {chatItem.unreadCount > 99 ? '99+' : chatItem.unreadCount}
                  </Text>
                </View>
              )}
            </View>

            {/* 消息内容区域 */}
            <View className='flex-1'>
              <View className='mb-1 flex flex-row items-center justify-between'>
                <Text className='text-base font-medium text-gray-900'>
                  {chatItem.name}
                </Text>
                <Text className='text-xs text-gray-500'>
                  {formatTime(chatItem.lastTime)}
                </Text>
              </View>
              <Text
                className={`text-sm ${
                  chatItem.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                } truncate`}
                numberOfLines={1}
              >
                {chatItem.lastMessage}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 底部导航栏 */}
      <TabBar current='chat' />
    </View>
  )
}
