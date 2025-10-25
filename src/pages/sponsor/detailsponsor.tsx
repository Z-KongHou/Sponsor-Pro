import Taro ,{ useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { getSponsorsInfo } from "@/router/api"

export default function SponsorDetail() {
  const router = useRouter()
  const { id, type } = router.params;
  

  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // 获取赞助详情数据
  useEffect(() => {
    const fetchSponsorDetail = async () => {
      setLoading(true)
      setError('')
      try {
        // 这里假设后端有获取详情的接口，根据项目实际情况调整
        if (!id) {
          throw new Error('无效的赞助ID')
        }
        const res = await getSponsorsInfo(parseInt(id));

        if (res.datainfo) {
          setDetail(res.datainfo)
        } else {
          throw new Error('获取赞助详情失败')
        }
      } catch (err) {
        console.error('获取赞助详情错误:', err)
        setError('获取赞助详情失败，请稍后重试')
        // 为了演示，使用模拟数据
      } finally {
        setLoading(false)
      }
    }

    fetchSponsorDetail()
  }, [id, type])

  if (loading) {
    return (
      <View className='flex h-screen items-center justify-center'>
        <Text className='text-gray-500'>加载中...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className='flex h-screen items-center justify-center'>
        <Text className='text-red-500'>{error}</Text>
      </View>
    )
  }

  if (!detail) {
    return (
      <View className='flex h-screen items-center justify-center'>
        <Text className='text-gray-500'>未找到赞助信息</Text>
      </View>
    )
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <View className='min-h-screen bg-gray-50'>

      <ScrollView className='pt-14 pb-6'>
        {/* 基本信息部分 */}
        <View className='mx-4 mb-4 rounded-xl bg-white p-5 shadow-sm'>
          <Text className='mb-2 block text-xl font-bold text-gray-800'>
            {detail.title}
          </Text>
          
          <View className='mb-4 flex items-center justify-between'>
            <View className='rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700'>
              {detail.type === 'COMPANY_INITIATED' ? '企业发起' : '学校发起'}
            </View>
          </View>

          <View className='mb-4 space-y-2 text-sm text-gray-600'>
            <View className='flex'>
              <Text className='w-16 text-gray-500'>创建时间：</Text>
              <Text>{formatDate(detail.createdAt)}</Text>
            </View>
            <View className='flex'>
              <Text className='w-16 text-gray-500'>更新时间：</Text>
              <Text>{formatDate(detail.updatedAt)}</Text>
            </View>
          </View>

          <View className='mb-2'>
            <Text className='mb-1 block text-base font-medium text-gray-700'>赞助金额</Text>
            <Text className='text-2xl font-bold text-blue-600'>
              ¥{detail.amount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* 赞助方案部分 */}
        <View className='mx-4 mb-4 rounded-xl bg-white p-5 shadow-sm'>
          <Text className='mb-3 block text-lg font-medium text-gray-800'>
            赞助方案
          </Text>
          <Text className='text-gray-600 leading-6'>
            {detail.description}
          </Text>
          
          {/* 赞助内容明细 */}
          <View className='mt-4 space-y-3'>
            <View className='flex items-start gap-2'>
              <View className='mt-1 h-2 w-2 rounded-full bg-blue-500' />
              <Text className='text-gray-600'>资金支持：提供项目所需的全部或部分资金</Text>
            </View>
            <View className='flex items-start gap-2'>
              <View className='mt-1 h-2 w-2 rounded-full bg-blue-500' />
              <Text className='text-gray-600'>技术指导：{detail.type === 'COMPANY_INITIATED' ? '企业提供专业技术人员指导' : '学校提供教育资源支持'}</Text>
            </View>
            <View className='flex items-start gap-2'>
              <View className='mt-1 h-2 w-2 rounded-full bg-blue-500' />
              <Text className='text-gray-600'>宣传合作：双方资源共享，共同推广项目</Text>
            </View>
          </View>
        </View>

        {/* 发布者信息部分 */}
        <View className='mx-4 mb-4 rounded-xl bg-white p-5 shadow-sm'>
          <Text className='mb-3 block text-lg font-medium text-gray-800'>
            发布者信息
          </Text>
          {detail.User_Sponsorship_initiatorIdToUser && (
            <View className='mb-4 rounded-lg bg-gray-50 p-4'>
              <Text className='mb-1 block text-sm text-gray-500'>
                名称
              </Text>
              <Text className='text-gray-700'>{detail.User_Sponsorship_initiatorIdToUser.name}</Text>
              <Text className='mt-1 block text-sm text-gray-500'>联系方式</Text>
              <Text className='text-gray-700'>{detail.User_Sponsorship_initiatorIdToUser.email}</Text>
            </View>
          )}

          {/* 接收方信息 */}
          {detail.receiver && (
            <>
              <Text className='mb-3 block text-base font-medium text-gray-700'>
                合作方信息
              </Text>
              <View className='rounded-lg bg-gray-50 p-4'>
                <Text className='mb-1 block text-sm text-gray-500'>
                  {detail.type === 'COMPANY_INITIATED' ? '学校名称' : '企业名称'}
                </Text>
                <Text className='text-gray-700'>{detail.receiver.name}</Text>
                <Text className='mt-1 block text-sm text-gray-500'>联系方式</Text>
                <Text className='text-gray-700'>{detail.receiver.email}</Text>
              </View>
            </>
          )}
        </View>

        {/* 操作按钮 */}
        <View className='mx-4 mt-6 space-y-3'>
          <View
            className={`w-full rounded-full bg-blue-600 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700`}
            onClick={() => {
              Taro.showToast({
                title: '联系功能开发中',
                icon: 'none'
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