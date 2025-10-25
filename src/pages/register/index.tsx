import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'

export default function Register() {
  const [selectedType, setSelectedType] = useState('')

  useLoad(() => {
    console.log('Register page loaded.')
  })

  const identityTypes = [
    {
      id: 'companyMember',
      title: '企业身份',
      subtitle: '赞助商、合作伙伴',
      description: '为企业提供赞助管理和活动参与服务',
      icon: '🏢',
      color: '#4F46E5',
      bgColor: '#EEF2FF'
    },
    {
      id: 'teacher',
      title: '老师身份',
      subtitle: '指导教师、辅导员',
      description: '为教师提供活动指导和资源管理',
      icon: '👨‍🏫',
      color: '#059669',
      bgColor: '#ECFDF5'
    },
    {
      id: 'clubMember',
      title: '社团身份',
      subtitle: '学生组织、社团',
      description: '为学生社团提供活动组织和资源对接',
      icon: '🎯',
      color: '#DC2626',
      bgColor: '#FEF2F2'
    }
  ]

const handle = async (type: string) => {
  setSelectedType(type);
  Taro.navigateTo({
    url: `/pages/register/${type}`
  })
};

  return (
    <View className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* 顶部装饰 */}
      <View className='absolute left-0 right-0 top-0 h-32 rounded-b-3xl bg-gradient-to-r from-blue-500 to-indigo-600'></View>

      <View className='relative flex flex-col items-center p-6 pt-8'>
        {/* 头部 */}
        <View className='mb-8 mt-3 text-center'>
          <Text className='mb-2 text-2xl font-bold text-white'>欢迎加入</Text>
          <Text className='text-blue-100'>请选择您的身份类型开始注册</Text>
        </View>

        {/* 身份选择卡片 */}
        <View className='mb-8 mt-3 space-y-4'>
          {identityTypes.map((item, index) => (
            <View
              key={item.id}
              className={`relative transform rounded-2xl border-2 bg-white p-4 shadow-lg transition-all duration-300 ${
                selectedType === item.id
                  ? 'scale-105 border-blue-500 shadow-blue-100'
                  : 'hover:scale-102 border-gray-100 hover:border-gray-200'
              }`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => handle(item.id)}
            >
              <View className='flex items-center space-x-4'>
                {/* 图标 */}
                <View
                  className='flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-md'
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Text>{item.icon}</Text>
                </View>

                {/* 内容 */}
                <View className='flex-1'>
                  <Text className='mb-1 text-xl font-bold text-gray-800'>
                    {item.title}
                  </Text>
                  <Text className='mb-2 text-sm text-gray-600'>
                    {item.subtitle}
                  </Text>
                  <Text className='text-xs leading-relaxed text-gray-500'>
                    {item.description}
                  </Text>
                </View>

                {/* 箭头 */}
                <View
                  className={`text-2xl transition-colors duration-200 ${
                    selectedType === item.id ? 'text-blue-500' : 'text-gray-300'
                  }`}
                >
                  <Text>›</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 底部说明 */}
        <View className='mb-6 text-center'>
          <Text className='text-sm leading-relaxed text-gray-500'>
            选择身份后将进入对应的注册流程，
            <Text className='text-blue-500'>不同身份享有不同的功能权限</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
