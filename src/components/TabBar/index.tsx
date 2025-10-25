import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface TabBarProps {
  current: string // 当前选中的页面
}

export default function TabBar({ current }: TabBarProps) {
  // 导航栏点击事件
  const handleNavClick = (page: string) => {
    if (page === current) {
      return // 已经在当前页面，不需要跳转
    }

    const routeMap: Record<string, string> = {
      home: '/pages/index/index',
      profile: '/pages/user/user',
      activities: '/pages/sponsor/schoolSponsor',
      sponsors: '/pages/sponsor/enterpriseSponsor'
    }

    if (routeMap[page]) {
      Taro.redirectTo({ url: routeMap[page] })
      return
    }

    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  // 导航项配置
  const tabItems = [
    {
      key: 'home',
      text: '首页',
      icon: '首',
      active: current === 'home'
    },
    {
      key: 'activities',
      text: '学校活动',
      icon: '活',
      active: current === 'activities'
    },
    {
      key: 'sponsors',
      text: '企业赞助',
      icon: '企',
      active: current === 'sponsors'
    },
    {
      key: 'profile',
      text: '个人中心',
      icon: '我',
      active: current === 'profile'
    }
  ]

  return (
    <View className='fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-2'>
      <View className='flex items-center justify-around'>
        {tabItems.map((item) => (
          <View
            key={item.key}
            className={`flex flex-col items-center rounded-lg px-3 py-2 ${
              item.active ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleNavClick(item.key)}
          >
            <View
              className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full ${
                item.active ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  item.active ? 'text-white' : 'text-gray-600'
                }`}
              >
                {item.icon}
              </Text>
            </View>
            <Text
              className={`text-xs ${
                item.active ? 'font-medium text-blue-600' : 'text-gray-500'
              }`}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
