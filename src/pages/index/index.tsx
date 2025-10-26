import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import TabBar from '../../components/TabBar';

export default function Index() {
  
  useLoad(async () => {
    console.log('Page loaded.');
  });

  const navigateToRegister = () => {
    Taro.navigateTo({ url: '/pages/register/index' });
  };

  const navigateToLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' });
  };

  return (
    <View className='min-h-screen bg-gray-50'>
      <ScrollView className='pb-20' scrollY>
        {/* 顶部横幅 */}
        <View className='bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6 pt-20'>
          <View className='text-center'>
            <Text className='text-2xl font-bold mb-2 block'>Hello Sponsor</Text>
            <Text className='text-sm opacity-90 block'>
              连接企业与学校，共创美好未来
            </Text>
          </View>
        </View>

        {/* 快速入口 */}
        <View className='px-6 py-8'>
          <View className='grid grid-cols-2 gap-4'>
            <View
              className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'
              onClick={navigateToRegister}
            >
              <View className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 mx-auto'>
                <Text className='text-white font-bold text-lg'>企</Text>
              </View>
              <Text className='text-gray-800 font-medium text-center block mb-1'>
                企业入驻
              </Text>
              <Text className='text-gray-500 text-xs text-center block'>
                发布赞助需求
              </Text>
            </View>

            <View
              className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'
              onClick={navigateToRegister}
            >
              <View className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 mx-auto'>
                <Text className='text-white font-bold text-lg'>校</Text>
              </View>
              <Text className='text-gray-800 font-medium text-center block mb-1'>
                学校入驻
              </Text>
              <Text className='text-gray-500 text-xs text-center block'>
                发布活动需求
              </Text>
            </View>

            <View
              className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'
              onClick={navigateToRegister}
            >
              <View className='w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-3 mx-auto'>
                <Text className='text-white font-bold text-lg'>师</Text>
              </View>
              <Text className='text-gray-800 font-medium text-center block mb-1'>
                教师入驻
              </Text>
              <Text className='text-gray-500 text-xs text-center block'>
                管理学生活动
              </Text>
            </View>

            <View
              className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'
              onClick={navigateToLogin}
            >
              <View className='w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mb-3 mx-auto'>
                <Text className='text-white font-bold text-lg'>登</Text>
              </View>
              <Text className='text-gray-800 font-medium text-center block mb-1'>
                用户登录
              </Text>
              <Text className='text-gray-500 text-xs text-center block'>
                进入平台
              </Text>
            </View>
          </View>
        </View>

        {/* 平台特色 */}
        <View className='px-6 py-6'>
          <Text className='text-xl font-bold text-gray-800 mb-6 block'>
            平台特色
          </Text>
          <View className='space-y-4'>
            <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
              <View className='flex items-center mb-3'>
                <View className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                  <Text className='text-2xl'>🤝</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-800 font-medium block'>
                    精准匹配
                  </Text>
                  <Text className='text-gray-500 text-sm block'>
                    智能算法匹配企业与学校需求
                  </Text>
                </View>
              </View>
            </View>

            <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
              <View className='flex items-center mb-3'>
                <View className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                  <Text className='text-2xl'>🔒</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-800 font-medium block'>
                    安全保障
                  </Text>
                  <Text className='text-gray-500 text-sm block'>
                    严格审核机制，确保合作安全
                  </Text>
                </View>
              </View>
            </View>

            <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
              <View className='flex items-center mb-3'>
                <View className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                  <Text className='text-2xl'>📊</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-800 font-medium block'>
                    数据透明
                  </Text>
                  <Text className='text-gray-500 text-sm block'>
                    全程跟踪，数据可视化展示
                  </Text>
                </View>
              </View>
            </View>

            <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
              <View className='flex items-center mb-3'>
                <View className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                  <Text className='text-2xl'>💼</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-800 font-medium block'>
                    专业服务
                  </Text>
                  <Text className='text-gray-500 text-sm block'>
                    专业团队提供全程服务支持
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 成功案例 */}
        <View className='px-6 py-6'>
          <Text className='text-xl font-bold text-gray-800 mb-6 block'>
            成功案例
          </Text>
          <View className='space-y-4'>
            <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
              <View className='mb-3'>
                <Text className='text-gray-800 font-medium block mb-2'>
                  某科技公司与XX大学合作
                </Text>
                <Text className='text-gray-600 text-sm block mb-2'>
                  成功赞助校园创新创业大赛，培养优秀人才
                </Text>
                <Text className='text-blue-600 font-medium text-sm block'>
                  合作金额：50万元
                </Text>
              </View>
            </View>

            <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
              <View className='mb-3'>
                <Text className='text-gray-800 font-medium block mb-2'>
                  某银行与XX学院合作
                </Text>
                <Text className='text-gray-600 text-sm block mb-2'>
                  赞助金融知识竞赛，提升学生实践能力
                </Text>
                <Text className='text-blue-600 font-medium text-sm block'>
                  合作金额：30万元
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 底部登录按钮 */}
        <View className='px-6 py-8 bg-white border-t border-gray-100'>
          <Button
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-base'
          >
            微信一键登录
          </Button>
          <Text className='text-gray-500 text-sm text-center block mt-3'>
            登录后即可享受完整服务
          </Text>
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <TabBar current='home' />
    </View>
  );
}
