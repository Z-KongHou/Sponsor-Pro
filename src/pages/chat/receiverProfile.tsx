import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useLayoutEffect } from 'react'
import { User } from '../../interface/userInfo'

export default function ReceiverProfile() {
  const [userInfo] = useState<User>({
    id: 1,
    name: '企业用户',
    email: 'enterprise@example.com',
    phone: '13800138000',
    role: 'COMPANY',
    CompanyMember: {
      id: 1,
      userId: 1,
      industry: '科技',
      companyName: '清华大学学生会',
      description:
        '我们是一支充满活力的校园团队，致力于为学生提供各种活动和机会。欢迎有意向的赞助商与我们联系合作。'
    }
  })
  const [startHeight, setStartHeight] = useState(0)

  useLayoutEffect(() => {
    setStartHeight(Taro.getMenuButtonBoundingClientRect().height)
  }, [])

  return (
    <View className='min-h-screen bg-gray-50'>
      <View className='bg-[#F7F7F7]' style={{ height: startHeight }}></View>
      <View className='flex items-center bg-[#F7F7F7] px-4 py-3'>
        <View
          className='w-1/3 text-sm font-bold'
          onClick={() => Taro.navigateBack()}
        >
          {`<`}
        </View>
        <Text className='flex flex-1 items-center justify-center text-lg font-medium text-gray-900'>
          接收方信息
        </Text>
        <View className='w-1/3'></View>
      </View>

      {/* 头像+名称+公司信息区域 */}
      <View className='mb-4 bg-[#F7F7F7] px-6 py-8'>
        <View className='flex flex-col items-center'>
          {/* 头像 */}
          <View
            className='mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-200'
            style={{ backgroundColor: '#60A5FA' }}
          >
            <Text className='text-2xl font-medium text-white'>企</Text>
          </View>

          {/* 名称 */}
          <Text className='mb-2 text-xl font-semibold text-gray-900'>
            {userInfo.name}
          </Text>

          {/* 所属公司/大学 */}
          <Text className='text-base text-gray-600'>
            {userInfo.CompanyMember?.companyName || '暂无公司信息'}
          </Text>
        </View>
      </View>

      {/* 个人介绍 */}
      <View className='mb-4 bg-[#F7F7F7] px-6 py-6'>
        <Text className='mb-4 text-lg font-medium text-gray-900'>个人介绍</Text>
        <Text className='text-base leading-relaxed text-gray-700'>
          {userInfo.CompanyMember?.description || '暂无个人介绍'}
        </Text>
      </View>

      {/* 功能列表 */}
      <View className='bg-[#F7F7F7]'>
        {/* 设置备注 */}
        <View
          className='flex items-center justify-between border-b border-gray-100 px-6 py-4'
          onClick={() => {}}
        >
          <Text className='text-base text-gray-900'>设置备注</Text>
        </View>

        {/* 查看聊天记录 */}
        <View
          className='flex items-center justify-between border-b border-gray-100 px-6 py-4'
          onClick={() => {}}
        >
          <Text className='text-base text-gray-900'>查看聊天记录</Text>
        </View>

        {/* 删除联系人 */}
        <View
          className='flex items-center justify-between px-6 py-4'
          onClick={() => {}}
        >
          <Text className='text-base text-red-600'>删除联系人</Text>
        </View>
      </View>
    </View>
  )
}
