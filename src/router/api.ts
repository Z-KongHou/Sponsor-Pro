import Taro from '@tarojs/taro'

const BASE_URL = 'http://127.0.0.1:6688/api' // ✅ 修改为你的后端地址

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
  data?: any
  header?: Record<string, string>
}

const request = async (options: RequestOptions) => {
  const { url, method = 'GET', data, params } = options
  const queryString = new URLSearchParams(params).toString();
  const token = Taro.getStorageSync('token')
  try {
    const res = await Taro.request({
      url: BASE_URL + url + (queryString ? `?${queryString}` : ''),
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
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

export const register = async (data: any) => {
  const res = await request({
    url: '/protect/register',
    method: 'POST',
    data: data
  })
  return res
}

export const getUserInfo = async () => {
  const res = await request({
    url: '/protect/userinfo',
    method: 'GET'
  })
  return res
}

export const getActivities = async (page: number, type: string, search: string) => {
  const res = await request({
    url: '/offline/sponsor/list',
    method: 'GET',
    params: {
      page,
      search,
      type
    }
  })
  return res
}

export const getSponsorsInfo = async (id: number) => {
  const res = await request({
    url: `/offline/sponsor/detail/${id}`,
    method: 'GET',
  })
  return res
}