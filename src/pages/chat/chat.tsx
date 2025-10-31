import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import TabBar from '@/components/TabBar'
import { useState } from 'react'

interface ChatItem {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unreadCount: number
}

export default function Chat() {
  // 模拟对话列表数据
  const [chatList] = useState<ChatItem[]>([
    {
      id: '1',
      name: '清华大学学生会',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '关于这次活动的赞助事宜，我们希望能够...',
      lastTime: '14:30',
      unreadCount: 2
    },
    {
      id: '2',
      name: '北京大学科技协会',
      avatar: 'https://img.yzcdn.cn/vant/logo.png',
      lastMessage: '好的，我们会尽快安排会议时间',
      lastTime: '昨天',
      unreadCount: 0
    },
    {
      id: '3',
      name: '复旦大学创业俱乐部',
      avatar: 'https://img.yzcdn.cn/vant/logo.png',
      lastMessage: '活动方案已经发送到您的邮箱，请查收',
      lastTime: '周三',
      unreadCount: 5
    },
    {
      id: '4',
      name: '上海交通大学学生会',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '期待与您的进一步合作',
      lastTime: '12月15日',
      unreadCount: 0
    },
    {
      id: '5',
      name: '浙江大学学术交流中心',
      avatar: 'https://img.yzcdn.cn/vant/logo.png',
      lastMessage: '我们会认真考虑您的提案',
      lastTime: '12月14日',
      unreadCount: 1
    },
    {
      id: '6',
      name: '南京大学学生组织联合会',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '谢谢您的支持！',
      lastTime: '12月13日',
      unreadCount: 0
    }
  ])

  // 处理聊天项点击事件
  const handleChatItemClick = (chatItem: ChatItem) => {
    Taro.navigateTo({
      url: `/pages/chat/privateChat?userId=${chatItem.id}&userName=${chatItem.name}&userAvatar=${chatItem.avatar}`
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
                src={chatItem.avatar}
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
                  chatItem.unreadCount > 0
                    ? 'font-medium text-gray-900'
                    : 'text-gray-600'
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
