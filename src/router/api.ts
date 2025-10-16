import Taro from '@tarojs/taro'

// 登录提示
const showLoginNotification = () => {
  // Taro.removeStorageSync('longtoken')
  Taro.showModal({
    title: '请先登录',
    content: '请先登录后再进行操作。',
    showCancel: false,
    confirmText: '确定'
  })
}

// 获取 token
const longtoken = Taro.getStorageSync('longtoken')

// 获取当前缓存的值（初始值）
export const getLongToken = (): string | null => longtoken

// 创建请求配置
const createRequestConfig = (baseURL: string) => ({
  url: baseURL,
  timeout: 10000,
  header: {
    'Content-Type': 'application/json',
    Authorization: longtoken ? `Bearer ${longtoken}` : ''
  }
})

// 创建 API 实例
const apiConfig = createRequestConfig('http://localhost:6677')

// 请求拦截器
const requestInterceptor = (config) => {
  // 更新 token（每次请求前重新获取，以防 token 被更新）
  const currentToken = Taro.getStorageSync('longtoken')
  if (currentToken) {
    config.header = {
      ...config.header,
      Authorization: `Bearer ${currentToken}`
    }
  }

  return config
}

// 响应拦截器 - 成功响应
const handleUnauthorizedResponse = (response) => {
  const data = response.data

  if (data?.code === 401 && data?.err_code === 'Error.UnAuthorized') {
    showLoginNotification()
    return Promise.reject(new Error('未授权'))
  }

  return response
}

// 响应拦截器 - 错误处理
const handleUnauthorized = (error) => {
  const data = error.data || error.response?.data

  if (data?.code === 401 && data?.err_code === 'Error.UnAuthorized') {
    showLoginNotification()
  }

  return Promise.reject(error)
}

const createRequest = (baseConfig) => {
  return (options) => {
    const fullUrl = options.url.startsWith('http')
      ? options.url
      : `${baseConfig.url}${options.url}`
    const config = {
      ...baseConfig,
      ...options,
      url: fullUrl,
      header: {
        ...baseConfig.header,
        ...options.header
      }
    }

    // 应用请求拦截器
    const interceptedConfig = requestInterceptor(config)

    return Taro.request(interceptedConfig)
      .then((response) => {
        // 应用响应拦截器
        return handleUnauthorizedResponse(response)
      })
      .catch((error) => {
        // 应用错误拦截器
        return handleUnauthorized(error)
      })
  }
}

// 创建 API 实例
const api = createRequest(apiConfig)

// 导出方法
export const getWeChatInfo = async (code: string, appcode: string) => {
  const res = await api({
    url: '/auth/login',
    method: 'POST',
    data: {
      code: code,
      appcode: appcode
    }
  })
  return res.data
}

export const register = async (data: object) => {
  const res = await api({
    url: '/auth/register',
    method: 'POST',
    data: data
  })
  return res.data
}
