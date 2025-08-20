import { View, Text, Input, Button, Textarea } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';

export default function EnterpriseRegister() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    phone: '',
    email: '',
    industry: '',
    description: '',
  });

  useLoad(() => {
    console.log('企业注册页面加载');
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('提交企业注册信息:', formData);
    // 这里可以添加表单验证和提交逻辑
    Taro.showToast({
      title: '注册信息已提交',
      icon: 'success',
    });
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* 顶部装饰 */}
      <View className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-3xl'></View>

      <View className='relative p-6 pt-8'>
        {/* 头部 */}
        <View className='text-center mb-8 mt-3'>
          <Text className='text-2xl font-bold text-white mb-2'>
            企业身份注册
          </Text>
          <Text className='text-blue-100'>请填写企业信息完成注册</Text>
        </View>

        {/* 表单 */}
        <View className='bg-white rounded-2xl p-6 shadow-lg space-y-2'>
          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>
              企业名称 *
            </Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base'
              placeholder='请输入企业名称'
              value={formData.companyName}
              onInput={(e) => handleInputChange('companyName', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>
              联系人 *
            </Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base'
              placeholder='请输入联系人姓名'
              value={formData.contactPerson}
              onInput={(e) =>
                handleInputChange('contactPerson', e.detail.value)
              }
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>
              联系电话 *
            </Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base'
              placeholder='请输入联系电话'
              type='number'
              value={formData.phone}
              onInput={(e) => handleInputChange('phone', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>
              邮箱地址
            </Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base'
              placeholder='请输入邮箱地址'
              type='text'
              value={formData.email}
              onInput={(e) => handleInputChange('email', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>
              所属行业
            </Text>
            <Input
              className='w-full px-2 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base'
              placeholder='请输入所属行业'
              value={formData.industry}
              onInput={(e) => handleInputChange('industry', e.detail.value)}
            />
          </View>

          <View>
            <Text className='text-base font-medium text-gray-700 mb-2'>
              企业简介
            </Text>
            <Textarea
              className='w-full px-2 py-3 border h-20 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none break-all text-base'
              placeholder='请简要描述企业情况'
              value={formData.description}
              onInput={(e) => handleInputChange('description', e.detail.value)}
              autoHeight
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
            className='m-0 bg-gray-100 text-gray-600 py-3 rounded-xl text-sm w-1/2'
            onClick={handleBack}
          >
            返回选择
          </Button>
        </View>

        {/* 底部说明 */}
        <View className='text-center mt-6'>
          <Text className='text-sm text-gray-500'>
            提交后我们将尽快审核您的企业信息
          </Text>
        </View>
      </View>
    </View>
  );
}
