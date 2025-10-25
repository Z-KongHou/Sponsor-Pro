import { useQuery } from '@tanstack/react-query'
import { getActivities } from '@/router/api'

export const useSponsorList = ({
  page,
  type,
  search,
}: {
  page: number
  type: string
  search: string
}) => {
  
  return useQuery({
    queryKey: ['postListMock', page, type, search],
    queryFn: async () => {
      console.log('🚀 useQuery 开始请求了！', page, type, search)
      try {
        const response = await getActivities(page, type, search)
        console.log('📊 请求响应:', response)
        return response?.data || response // 兼容不同的响应结构
      } catch (err) {
        console.error('网络请求失败:', err)
        throw err
      }
    },
  })
}
