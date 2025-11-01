import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import TabBar from '../../components/TabBar'

export default function Index() {
  useLoad(async () => {
    console.log('Page loaded.')
  })

  const navigateToRegister = () => {
    Taro.navigateTo({ url: '/pages/register/index' })
  }

  return (
    <View className='min-h-screen bg-gray-50'>
      <ScrollView className='pb-20' scrollY>
        {/* 顶部横幅 */}
        <View className='bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 pt-20 text-white'>
          <View className='text-center'>
            <Text className='mb-2 block text-2xl font-bold'>Hello Sponsor</Text>
            <Text className='block text-sm opacity-90'>
              连接企业与学校，共创美好未来
            </Text>
          </View>
        </View>

        {/* 快速入口 */}
        <View className='px-6 py-8'>
          <View className='grid grid-cols-2 gap-4'>
            <View
              className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
              onClick={navigateToRegister}
            >
              <View className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500'>
                <Text className='text-lg font-bold text-white'>企</Text>
              </View>
              <Text className='mb-1 block text-center font-medium text-gray-800'>
                企业入驻
              </Text>
              <Text className='block text-center text-xs text-gray-500'>
                发布赞助需求
              </Text>
            </View>

            <View
              className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
              onClick={navigateToRegister}
            >
              <View className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600'>
                <Text className='text-lg font-bold text-white'>校</Text>
              </View>
              <Text className='mb-1 block text-center font-medium text-gray-800'>
                学校入驻
              </Text>
              <Text className='block text-center text-xs text-gray-500'>
                发布活动需求
              </Text>
            </View>

            <View
              className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
              onClick={navigateToRegister}
            >
              <View className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-700'>
                <Text className='text-lg font-bold text-white'>师</Text>
              </View>
              <Text className='mb-1 block text-center font-medium text-gray-800'>
                教师入驻
              </Text>
              <Text className='block text-center text-xs text-gray-500'>
                管理学生活动
              </Text>
            </View>

            <View
              className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
              onClick={() => Taro.navigateTo({ url: '/pages/check/check' })}
            >
              <View className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-800'>
                <Text className='text-lg font-bold text-white'>登</Text>
              </View>
              <Text className='mb-1 block text-center font-medium text-gray-800'>
                用户登录
              </Text>
              <Text className='block text-center text-xs text-gray-500'>
                进入平台
              </Text>
            </View>
          </View>
        </View>

        {/* 平台特色 */}
        <View className='px-6 py-6'>
          <Text className='mb-6 block text-xl font-bold text-gray-800'>
            平台特色
          </Text>
          <View className='space-y-4'>
            <View className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
              <View className='mb-3 flex items-center'>
                <View className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                  <Text className='text-2xl'>🤝</Text>
                </View>
                <View className='flex-1'>
                  <Text className='block font-medium text-gray-800'>
                    精准匹配
                  </Text>
                  <Text className='block text-sm text-gray-500'>
                    智能算法匹配企业与学校需求
                  </Text>
                </View>
              </View>
            </View>

            <View className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
              <View className='mb-3 flex items-center'>
                <View className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                  <Text className='text-2xl'>🔒</Text>
                </View>
                <View className='flex-1'>
                  <Text className='block font-medium text-gray-800'>
                    安全保障
                  </Text>
                  <Text className='block text-sm text-gray-500'>
                    严格审核机制，确保合作安全
                  </Text>
                </View>
              </View>
            </View>

            <View className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
              <View className='mb-3 flex items-center'>
                <View className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                  <Text className='text-2xl'>📊</Text>
                </View>
                <View className='flex-1'>
                  <Text className='block font-medium text-gray-800'>
                    数据透明
                  </Text>
                  <Text className='block text-sm text-gray-500'>
                    全程跟踪，数据可视化展示
                  </Text>
                </View>
              </View>
            </View>

            <View className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
              <View className='mb-3 flex items-center'>
                <View className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                  <Text className='text-2xl'>💼</Text>
                </View>
                <View className='flex-1'>
                  <Text className='block font-medium text-gray-800'>
                    专业服务
                  </Text>
                  <Text className='block text-sm text-gray-500'>
                    专业团队提供全程服务支持
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 成功案例 */}
        <View className='px-6 py-6'>
          <Text className='mb-6 block text-xl font-bold text-gray-800'>
            成功案例
          </Text>
          <View className='space-y-4'>
            <View className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
              <View className='mb-3'>
                <Text className='mb-2 block font-medium text-gray-800'>
                  某科技公司与XX大学合作
                </Text>
                <Text className='mb-2 block text-sm text-gray-600'>
                  成功赞助校园创新创业大赛，培养优秀人才
                </Text>
                <Text className='block text-sm font-medium text-blue-600'>
                  合作金额：50万元
                </Text>
              </View>
            </View>

            <View className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
              <View className='mb-3'>
                <Text className='mb-2 block font-medium text-gray-800'>
                  某银行与XX学院合作
                </Text>
                <Text className='mb-2 block text-sm text-gray-600'>
                  赞助金融知识竞赛，提升学生实践能力
                </Text>
                <Text className='block text-sm font-medium text-blue-600'>
                  合作金额：30万元
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 底部登录按钮 */}
        <View className='border-t border-gray-100 bg-white px-6 py-8'>
          <Button className='w-full rounded-lg bg-blue-600 py-3 text-base font-medium text-white'>
            微信一键登录
          </Button>
          <Text className='mt-3 block text-center text-sm text-gray-500'>
            登录后即可享受完整服务
          </Text>
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <TabBar current='home' />
    </View>
  )
}
