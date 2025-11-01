import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { setUserInfo } from '@/features/oppositeUser'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { CreateSession } from '@/router/api'


export default function SponsorDetail() {
  const sponsorInfo = useAppSelector((state) => state.sponsorInfo)
  // 从全局状态中获取当前用户信息
  const currentUser = useAppSelector((state) => state.user.profile)
  const dispatch = useAppDispatch()

  return (
    <View className='min-h-screen bg-gray-50'>
      <ScrollView className='pb-6 pt-14'>
        {/* 基本信息部分 */}
        <View className='mx-4 mb-4 rounded-xl bg-white p-5 shadow-sm'>
          <Text className='mb-2 block text-xl font-bold text-gray-800'>
            {sponsorInfo.title}
          </Text>

          <View className='mb-4 flex items-center justify-between'>
            <View className='rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700'>
              {sponsorInfo.type === 'COMPANY_INITIATED'
                ? '企业发起'
                : '学校发起'}
            </View>
          </View>

          <View className='mb-4 space-y-2 text-sm text-gray-600'>
            <View className='flex'>
              <Text className='w-16 text-gray-500'>起始：</Text>
              <Text>{sponsorInfo.time_from}</Text>
            </View>
            <View className='flex'>
              <Text className='w-16 text-gray-500'>结束：</Text>
              <Text>{sponsorInfo.time_end}</Text>
            </View>
          </View>

          <View className='mb-2'>
            <Text className='mb-1 block text-base font-medium text-gray-700'>
              赞助金额
            </Text>
            <Text className='text-2xl font-bold text-blue-600'>
              ¥{sponsorInfo.amount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* 赞助方案部分 */}
        <View className='mx-4 mb-4 rounded-xl bg-white p-5 shadow-sm'>
          <Text className='mb-3 block text-lg font-medium text-gray-800'>
            赞助方案
          </Text>
          <Text className='leading-6 text-gray-600'>
            {sponsorInfo.description}
          </Text>

          {/* 赞助内容明细 */}
          <View className='mt-4 space-y-3'>
            <View className='flex items-start gap-2'>
              <View className='mt-1 h-2 w-2 rounded-full bg-blue-500' />
              <Text className='text-gray-600'>
                资金支持：提供项目所需的全部或部分资金
              </Text>
            </View>
            <View className='flex items-start gap-2'>
              <View className='mt-1 h-2 w-2 rounded-full bg-blue-500' />
              <Text className='text-gray-600'>
                技术指导：
                {sponsorInfo.type === 'COMPANY_INITIATED'
                  ? '企业提供专业技术人员指导'
                  : '学校提供教育资源支持'}
              </Text>
            </View>
            <View className='flex items-start gap-2'>
              <View className='mt-1 h-2 w-2 rounded-full bg-blue-500' />
              <Text className='text-gray-600'>
                宣传合作：双方资源共享，共同推广项目
              </Text>
            </View>
          </View>
        </View>

        {/* 发布者信息部分 */}
        <View className='mx-4 mb-4 rounded-xl bg-white p-5 shadow-sm'>
          <Text className='mb-3 block text-lg font-medium text-gray-800'>
            发布者信息
          </Text>
          {sponsorInfo.initiatorIdToUser && (
            <View className='mb-4 rounded-lg bg-gray-50 p-4'>
              <Text className='mb-1 block text-sm text-gray-500'>名称</Text>
              <Text className='text-gray-700'>
                {sponsorInfo.initiatorIdToUser.name}
              </Text>
              <Text className='mt-1 block text-sm text-gray-500'>联系方式</Text>
              <Text className='text-gray-700'>
                {sponsorInfo.initiatorIdToUser.email}
              </Text>
            </View>
          )}

          {/* 接收方信息 */}
          {/* {sponsorInfo.receiver && (
            <>
              <Text className='mb-3 block text-base font-medium text-gray-700'>
                合作方信息
              </Text>
              <View className='rounded-lg bg-gray-50 p-4'>
                <Text className='mb-1 block text-sm text-gray-500'>
                  {sponsorInfo.type === 'COMPANY_INITIATED'
                    ? '学校名称'
                    : '企业名称'}
                </Text>
                <Text className='text-gray-700'>{sponsorInfo.receiver.name}</Text>
                <Text className='mt-1 block text-sm text-gray-500'>
                  联系方式
                </Text>
                <Text className='text-gray-700'>{sponsorInfo.receiver.email}</Text>
              </View>
            </>
          )} */}
        </View>

        {/* 操作按钮 */}
        <View className='mx-4 mt-6 space-y-3'>
          <View
            className='w-full rounded-full bg-blue-600 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700'
            onClick={async () => {
              dispatch(
                setUserInfo({
                  id: sponsorInfo.initiatorIdToUser.id,
                  name: sponsorInfo.initiatorIdToUser.name,
                  email: sponsorInfo.initiatorIdToUser.email,
                  role: sponsorInfo.initiatorIdToUser.role,
                  avatarUrl: sponsorInfo.initiatorIdToUser.avatarurl
                })
              )
              // 使用当前用户ID创建会话
              if (currentUser) {
                const sessionId = `sessionId-${[sponsorInfo.initiatorIdToUser.id, currentUser.id].sort().join('-')}`
                await CreateSession(sponsorInfo.initiatorIdToUser.id, currentUser.id, sessionId)
              } else {
                Taro.showToast({ title: '请先登录', icon: 'none' })
                return
              }
              Taro.navigateTo({
                url: `/pages/chat/privateChat`
              })
            }}
          >
            立即联系
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
