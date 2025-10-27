import Taro from '@tarojs/taro'
import { wxLogin } from '../router/api';

export const wxlogin = async () => {
  try {
    Taro.showLoading({ title: '登录中...', mask: true })
    
    // 1. 获取微信登录code
    const loginRes = await Taro.login()
    
    console.log(loginRes.code)
    const wxLoginRes = await wxLogin(loginRes.code)
    
    // 3. 校验返回数据
    if (!wxLoginRes.token) {
      throw new Error('用户不存在')
    }
    
    // 4. 存储token
    Taro.setStorageSync('token', wxLoginRes.token)
    Taro.setStorageSync('role', wxLoginRes.role)
    
  } catch (error) {
    console.error('微信登录失败:', error)
    let errorMsg = '登录失败，请重试'
    if (error?.errMsg?.includes('login:fail')) {
      errorMsg = '微信登录失败'
    } else if (error?.message?.includes('token')) {
      errorMsg = '系统繁忙，请稍后重试'
    }
    
    Taro.showToast({ 
      title: errorMsg, 
      icon: 'none',
      duration: 2000 
    })
    throw new Error(errorMsg)
  } finally {
    Taro.hideLoading()
  }
}