import { View, Text  } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import Taro from '@tarojs/taro'

export default function Register () {
  const [selectedType, setSelectedType] = useState('')

  useLoad(() => {
    console.log('Register page loaded.')
  })

  const identityTypes = [
    {
      id: 'enterprise',
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
      id: 'club',
      title: '社团身份',
      subtitle: '学生组织、社团',
      description: '为学生社团提供活动组织和资源对接',
      icon: '🎯',
      color: '#DC2626',
      bgColor: '#FEF2F2'
    }
  ]

  const handleSelect = (type: string) => {
    setSelectedType(type)
    console.log('选择身份类型:', type)
    Taro.navigateTo({
      url: `/pages/register/${type}`
    })
  }

  return (
    <View className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* 顶部装饰 */}
      <View className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-3xl'></View>
      
      <View className='relative p-6 pt-8 flex flex-col items-center'>
        {/* 头部 */}
        <View className='text-center mb-8 mt-3'>

          <Text className='text-2xl font-bold text-white mb-2'>欢迎加入</Text>
          <Text className='text-blue-100'>请选择您的身份类型开始注册</Text>
        </View>

        {/* 身份选择卡片 */}
        <View className='space-y-4 mb-8 mt-3'>
          {identityTypes.map((item, index) => (
            <View
              key={item.id}
              className={`relative bg-white rounded-2xl p-4 shadow-lg border-2 transition-all duration-300 transform ${
                selectedType === item.id 
                  ? 'border-blue-500 shadow-blue-100 scale-105' 
                  : 'border-gray-100 hover:border-gray-200 hover:scale-102'
              }`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => handleSelect(item.id)}
            >

              <View className='flex items-center space-x-4'>
                {/* 图标 */}
                <View 
                  className='w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md'
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Text>{item.icon}</Text>
                </View>

                {/* 内容 */}
                <View className='flex-1'>
                  <Text className='text-xl font-bold text-gray-800 mb-1'>
                    {item.title}
                  </Text>
                  <Text className='text-sm text-gray-600 mb-2'>
                    {item.subtitle}
                  </Text>
                  <Text className='text-xs text-gray-500 leading-relaxed'>
                    {item.description}
                  </Text>
                </View>

                {/* 箭头 */}
                <View className={`text-2xl transition-colors duration-200 ${
                  selectedType === item.id ? 'text-blue-500' : 'text-gray-300'
                }`}>
                  <Text>›</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 底部说明 */}
        <View className='text-center mb-6'>
          <Text className='text-sm text-gray-500 leading-relaxed'>
            选择身份后将进入对应的注册流程，<Text className='text-blue-500'>不同身份享有不同的功能权限</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
