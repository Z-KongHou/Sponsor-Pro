import { View, Text, Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { info } from '@/interface/sponsorInfo'
import Taro from '@tarojs/taro'
import TabBar from '@/components/TabBar'
import FloatingActionButton from '@/components/SponsorButton'
import ListItem from '@/components/sponsorItem'
import { useAppDispatch } from '@/app/hooks'
import { setSponsorInfo } from '@/features/sponsorInfo'
import { getActivities } from '../../router/api'

type sponsorType = 'COMPANY_INITIATED' | 'SCHOOL_INITIATED'

export default function SponsorSponsor() {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('') // 临时存储用户输入
  const [type, setType] = useState<sponsorType>('SCHOOL_INITIATED')
  const [Data, setData] = useState<info[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const pageSize = 6

  const dispatch = useAppDispatch()
  // 当搜索关键词变化时重置到第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [searchKeyword])

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 调用API获取数据，type参数根据传入的type值进行替换
        const response = await getActivities(currentPage, type, searchKeyword)
        // 假设API返回的数据结构包含data数组和totalCount字段
        if (response && response.data) {
          setData(response.data)
          setTotalCount(response.totalCount || response.data.length)
        }
      } catch (error) {
        console.error('获取赞助数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchKeyword, currentPage, type])

  // 清除所有筛选条件
  const clearFilters = () => {
    setSearchKeyword('')
    setCurrentPage(1)
  }
  // 计算总页数
  const totalPages = Math.ceil(totalCount / pageSize)

  // 准备渲染的数据
  const displayData = Data || []

  // 页码变化处理
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <View className='min-h-screen bg-gray-50 pb-20 pt-20'>
      <View className='bg-white px-4 py-2 shadow-sm'>
        <View className='flex overflow-hidden rounded-xl'>
          <Button
            className={`py-2 text-base font-medium transition-all duration-200 ${type === 'SCHOOL_INITIATED' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setType('SCHOOL_INITIATED')}
          >
            👨‍🏫 学校发起
          </Button>
          <View className='w-0.5 self-stretch bg-gray-200'></View>
          <Button
            className={`py-2 text-base font-medium transition-all duration-200 ${type === 'COMPANY_INITIATED' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setType('COMPANY_INITIATED')}
          >
            🏢 企业发起
          </Button>
        </View>
      </View>

      {/* 搜索栏 */}
      <View className='sticky top-0 z-10 bg-white p-2 shadow-sm'>
        <View className='align-center flex h-10 gap-2'>
          <View className='flex items-center justify-center rounded'>🔍</View>
          <Input
            className='h-full flex-1'
            placeholder='搜索活动'
            value={searchInput}
            onInput={(e) => setSearchInput(e.detail.value)}
          />
          <Button
            className='flex h-8 items-center justify-center self-center rounded bg-blue-500 text-sm text-white'
            onClick={() => setSearchKeyword(searchInput)}
          >
            搜索
          </Button>
        </View>
      </View>

      {/* 搜索栏 */}
      <View className='mb-3 bg-white p-4 shadow-sm'>
        <View className='flex flex-wrap gap-3'>
          {/* 清除筛选按钮 */}
          {searchKeyword && (
            <Button
              className='flex-shrink-0 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-600'
              onClick={clearFilters}
            >
              清除筛选
            </Button>
          )}
        </View>
      </View>

      {/* 加载状态 */}
      {loading && (
        <View className='mb-3 px-4 py-4 text-center'>
          <Text className='text-sm text-gray-500'>加载中...</Text>
        </View>
      )}

      {/* 数据统计 */}
      {totalCount > 0 && (
        <View className='mb-3 px-4'>
          <Text className='text-sm text-gray-500'>
            共找到 {totalCount} 个赞助项目，当前显示第{' '}
            {(currentPage - 1) * pageSize + 1} 到{' '}
            {Math.min(currentPage * pageSize, totalCount)} 条
          </Text>
        </View>
      )}

      {/* 赞助列表 */}
      <View className='space-y-3 px-4'>
        {displayData.length > 0 ? (
          displayData.map((item, index) => (
            <View
              key={index}
              onClick={() => {
                dispatch(setSponsorInfo(item))
                Taro.navigateTo({
                  url: `/pages/sponsor/detailSponsor`
                })
              }}
            >
              <ListItem data={item} />
            </View>
          ))
        ) : !loading ? (
          <View className='rounded-xl bg-white p-8 text-center'>
            <Text className='text-lg text-gray-400'>暂无数据</Text>
            <Text className='mt-2 block text-sm text-gray-300'>
              尝试调整筛选条件或搜索关键词
            </Text>
          </View>
        ) : null}
      </View>

      {/* 分页组件 */}
      {totalCount > 0 && (
        <View className='mt-4 flex items-center gap-3'>
          <Button
            className='rounded border border-gray-200 bg-white text-gray-600'
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <Text>上一页</Text>
          </Button>

          <View className='flex items-center gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 简单的分页逻辑，显示前5页或最后5页
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-full text-sm ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </View>

          <Button
            className='rounded border border-gray-200 bg-white text-gray-600'
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <Text>下一页</Text>
          </Button>
        </View>
      )}

      {/* 底部导航栏 */}
      <TabBar current='sponsors' />

      <FloatingActionButton />
    </View>
  )
}
