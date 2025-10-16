import { View, Text, Input, Button, Picker } from '@tarojs/components'
import { useState, useEffect } from 'react'
import ListItem from '@/components/sponsorItem/sponsorItem'
import TabBar from '@/components/TabBar'
import { info } from '../../interface/sponsorInfo'

// 模拟数据
const mockData: info[] = [
  {
    name: '123132',
    school: '浙江大学',
    categories: '教育',
    position: '杭州',
    time_from: '2023-09-01',
    time_end: '2024-06-30',
    value: 850000
  },
  {
    name: '123123',
    school: '宁波大学',
    categories: '科技',
    position: '宁波',
    time_from: '2023-10-15',
    time_end: '2024-05-15',
    value: 500000
  },
  {
    name: '123123',
    school: '杭州电子科技大学',
    categories: '科技',
    position: '杭州',
    time_from: '2023-08-20',
    time_end: '2024-07-20',
    value: 1200000
  },
  {
    name: '12312323',
    school: '浙江工业大学',
    categories: '工业',
    position: '杭州',
    time_from: '2023-09-05',
    time_end: '2024-06-05',
    value: 600000
  },
  {
    name: '123456',
    school: '温州医科大学',
    categories: '医疗',
    position: '温州',
    time_from: '2023-11-01',
    time_end: '2024-08-01',
    value: 950000
  },
  {
    name: '654321',
    school: '浙江师范大学',
    categories: '教育',
    position: '金华',
    time_from: '2023-09-10',
    time_end: '2024-07-10',
    value: 450000
  },
  {
    name: '789012',
    school: '浙江工商大学',
    categories: '商业',
    position: '杭州',
    time_from: '2023-10-01',
    time_end: '2024-06-30',
    value: 750000
  },
  {
    name: '210987',
    school: '中国美术学院',
    categories: '艺术',
    position: '杭州',
    time_from: '2023-12-01',
    time_end: '2024-09-01',
    value: 300000
  }
]

export default function SchoolSponsor() {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('全部')
  const [positionFilter, setPositionFilter] = useState('全部')
  const [filteredData, setFilteredData] = useState<info[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(4) // 默认每页显示4条数据
  const [paginatedData, setPaginatedData] = useState<info[]>([])

  setPageSize(4)
  // 提取所有不重复的分类和地区
  const categories = [
    '全部',
    ...Array.from(new Set(mockData.map((item) => item.categories)))
  ]
  const positions = [
    '全部',
    ...Array.from(new Set(mockData.map((item) => item.position)))
  ]

  // 过滤和排序数据
  useEffect(() => {
    let result = [...mockData]

    // 搜索过滤
    if (searchKeyword) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    }

    // 分类过滤
    if (categoryFilter !== '全部') {
      result = result.filter((item) => item.categories === categoryFilter)
    }

    // 地区过滤
    if (positionFilter !== '全部') {
      result = result.filter((item) => item.position === positionFilter)
    }

    setFilteredData(result)
    setTotalCount(result.length)
    // 重置到第一页，当筛选条件改变时
    setCurrentPage(1)
  }, [searchKeyword, categoryFilter, positionFilter])

  // 清除所有筛选条件
  const clearFilters = () => {
    setSearchKeyword('')
    setCategoryFilter('全部')
    setPositionFilter('全部')
    setCurrentPage(1)
  }

  // 分页逻辑
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filteredData.slice(startIndex, endIndex)
    setPaginatedData(paginated)
  }, [filteredData, currentPage, pageSize])

  // 计算总页数
  const totalPages = Math.ceil(totalCount / pageSize)

  // 页码变化处理
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <View className='min-h-screen bg-gray-50 pb-20'>
      {/* 搜索栏 */}
      <View className='sticky top-0 z-10 bg-white p-4 shadow-sm'>
        <View className='align-center flex gap-2'>
          <View className=''>🔍</View>
          <Input
            className=''
            placeholder='搜索赞助'
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      {/* 筛选和排序栏 */}
      <View className='mb-3 bg-white p-4 shadow-sm'>
        <View className='flex flex-wrap gap-3'>
          {/* 分类筛选 */}
          <Picker
            mode='selector'
            range={categories}
            value={categories.indexOf(categoryFilter)}
            onChange={(e) => setCategoryFilter(categories[e.detail.value])}
            className='flex-shrink-0'
          >
            <View className='rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700'>
              分类: {categoryFilter}
            </View>
          </Picker>

          {/* 地区筛选 */}
          <Picker
            mode='selector'
            range={positions}
            value={positions.indexOf(positionFilter)}
            onChange={(e) => setPositionFilter(positions[e.detail.value])}
            className='flex-shrink-0'
          >
            <View className='rounded-full border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700'>
              地区: {positionFilter}
            </View>
          </Picker>

          {/* 清除筛选按钮 */}
          <Button
            className='flex-shrink-0 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-600'
            onClick={clearFilters}
          >
            清除筛选
          </Button>
        </View>
      </View>

      {/* 数据统计 */}
      {filteredData.length > 0 && (
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
        {paginatedData.length > 0 ? (
          paginatedData.map((item, index) => (
            <ListItem key={index} data={item} />
          ))
        ) : (
          <View className='rounded-xl bg-white p-8 text-center'>
            <Text className='text-lg text-gray-400'>暂无数据</Text>
            <Text className='mt-2 block text-sm text-gray-300'>
              尝试调整筛选条件或搜索关键词
            </Text>
          </View>
        )}
      </View>

      {/* 分页组件 */}
      {filteredData.length > 0 && (
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
      <TabBar current='activities' />
    </View>
  )
}
