import { View, Text, Input, Button } from '@tarojs/components'
import Taro,{ useLoad } from '@tarojs/taro'
import { useState,useEffect } from 'react'
import { register } from '../../router/api'

export default function TeacherRegister() {
  const [formData, setFormData] = useState({
    name: '',
    open_id: '',
    phone: '',
    email: '',
    school: '',
    department: '',
    subject: '',
    role: "teacher"
  })

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      open_id: Taro.getStorageSync('open_id') || ''
    }));
  }, []);

  useLoad(() => {
    console.log('老师注册页面加载')
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    const isFormValid = Object.values(formData).every(val => {
      return val != null && val.toString().trim() !== "";
    });
    if (!isFormValid) {
      Taro.showToast({
        title: '请填写所有必填信息',
        icon: 'error'
      });
      return;
    }
    const res = await register(formData)
    console.log(res)
    Taro.showToast({
      title: res.data.data.message,
      icon: res.data.code==201 || res.data.code==200 ? 'success':'error'
    })
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* 顶部装饰 */}
      <View className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-3xl'></View>
      
      <View className='relative p-4 pt-8'>
        {/* 头部 */}
        <View className='text-center mb-8 mt-3'>
          <Text className='text-2xl font-bold text-white mb-2'>老师身份注册</Text>
          <Text className='text-blue-100'>请填写教师信息完成注册</Text>
        </View>

        {/* 表单 */}
        <View className='bg-white rounded-2xl p-6 shadow-lg space-y-2'>
          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>姓名 *</Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base'
              placeholder='请输入真实姓名'
              value={formData.name}
              onInput={(e) => handleInputChange('name', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>联系电话 *</Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base'
              placeholder='请输入联系电话'
              type='number'
              value={formData.phone}
              onInput={(e) => handleInputChange('phone', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>邮箱地址</Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base'
              placeholder='请输入邮箱地址'
              type='text'
              value={formData.email}
              onInput={(e) => handleInputChange('email', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>所属学校 *</Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base'
              placeholder='请输入所属学校'
              value={formData.school}
              onInput={(e) => handleInputChange('school', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>院系部门</Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base'
              placeholder='请输入院系或部门'
              value={formData.department}
              onInput={(e) => handleInputChange('department', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>职称</Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base'
              placeholder='如：教授、副教授、讲师等'
              value={formData.subject}
              onInput={(e) => handleInputChange('subject', e.detail.value)}
            />
          </View>
        </View>

        {/* 按钮组 */}
        <View className='mt-6 gap-6 flex items-center'>
          <Button
            className='m-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl text-sm shadow-lg w-1/2'
            onClick={handleSubmit}
          >
            提交注册
          </Button>
          <Button
            className='m-0 bg-gray-100 text-gray-600 text-sm py-3 rounded-xl w-1/2'
            onClick={handleBack}
          >
            返回选择
          </Button>
        </View>

        {/* 底部说明 */}
        <View className='text-center mt-6'>
          <Text className='text-sm text-gray-500'>
            提交后我们将验证您的教师身份信息
          </Text>
        </View>
      </View>
    </View>
  )
} 