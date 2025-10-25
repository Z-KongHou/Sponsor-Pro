import Taro from '@tarojs/taro'
import { UserInfo } from './type'

const BASE_URL = 'http://127.0.0.1:3000/api' // ✅ 修改为你的后端地址

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: unknown
  header?: Record<string, string>
}

const request = async (options: RequestOptions) => {
  const { url, method = 'GET', data } = options

  const token = Taro.getStorageSync('token')
  try {
    const res = await Taro.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    // 根据你的后端约定检查状态码
    if (res.statusCode === 200) {
      return res.data
    } else {
      Taro.showToast({
        title: res.data?.message || '请求出错',
        icon: 'none'
      })
      return Promise.reject(res)
    }
  } catch (error) {
    Taro.showToast({
      title: '网络错误，请检查连接',
      icon: 'none'
    })
    return Promise.reject(error)
  }
}

// 导出方法
export const wxLogin = async (code: string) => {
  const res = await request({
    url: '/auth/wxlogin',
    method: 'POST',
    data: {
      code: code
    }
  })
  return res
}

export const register = async (role: string) => {
  const res = await request({
    url: '/protect/register',
    method: 'POST',
    data: {
      role: role
    }
  })
  return res
}
// 获取用户信息
export const getUserInfo = async () => {
  const res = await request({
    url: '/protect/userinfo',
    method: 'GET'
  })
  return res.data as UserInfo
}

// 更新用户信息
export const updateUserInfo = async (
  userData: unknown, // 待补充
  extensionData?: unknown
) => {
  const res = await request({
    url: '/protect/userinfo',
    method: 'POST',
    data: {
      userData,
      extensionData
    }
  })
  return res.data
}
// 获取用户的赞助记录
export const getSponsorInfoByUserID = async (userID: string) => {
  const res = await request({
    url: `/user/sponsor?userID=${userID}`,
    method: 'GET'
  })
  return res
}

// 创建新的赞助记录
export const createSponsor = async (sponsorData: unknown) => {
  const res = await request({
    url: '/sponsor/create',
    method: 'POST',
    data: sponsorData
  })
  return res.data
}
// 删除赞助记录
export const deleteSponsor = async (id: number) => {
  const res = await request({
    url: `/sponsor/delete/${id}`,
    method: 'DELETE'
  })
  return res.data
}

// 更新赞助状态
export const updateSponsorStatus = async (id: number, status: string) => {
  const res = await request({
    url: `/sponsor/update-status/${id}`,
    method: 'PUT',
    data: { status }
  })
  return res.data
}
