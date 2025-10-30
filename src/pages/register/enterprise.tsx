import { View, Text, Input, Button, Textarea } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import { register } from '../../router/api';

export default function EnterpriseRegister() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    phone: '',
    email: '',
    industry: '',
    description: '',
    role: 'companyMember'
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

  const handleSubmit = async () => {
    // 验证必填项
    if (!formData.companyName.trim()) {
      Taro.showToast({
        title: '请输入企业名称',
        icon: 'error'
      });
      return;
    }
    if (!formData.name.trim()) {
      Taro.showToast({
        title: '请输入联系人姓名',
        icon: 'error'
      });
      return;
    }
    if (!formData.phone.trim()) {
      Taro.showToast({
        title: '请输入联系电话',
        icon: 'error'
      });
      return;
    }

    try {
      Taro.showLoading({ title: '提交中...' });
      const res = await register(formData);
      Taro.hideLoading();
      
      if (res.success) {
        Taro.showToast({
          title: '注册成功',
          icon: 'success'
        });
        // 注册成功后跳转到首页或用户页面
        setTimeout(() => {
          Taro.navigateTo({ url: '/pages/index/index' });
        }, 1500);
      } else {
        Taro.showToast({
          title: res.error || '注册失败',
          icon: 'error'
        });
      }
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error || '网络错误，请重试',
        icon: 'none'
      });
      console.error('注册失败:', error);
    }
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
              value={formData.name}
              onInput={(e) =>
                handleInputChange('name', e.detail.value)
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
