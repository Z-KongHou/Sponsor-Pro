import { View, Text, Image, Button } from '@tarojs/components'
import { useState, useMemo } from 'react'
import { AtPagination } from 'taro-ui'

interface Activity {
  id: number
  title: string
  type: string
  mode: string
}

const allOnShelf: Activity[] = [
  { id: 1, title: '校园歌手大赛', type: '文体', mode: '物资' },
  { id: 2, title: '程序设计挑战', type: '学术', mode: '资金' }
]
const allOffShelf: Activity[] = [
  { id: 3, title: '公益植树', type: '公益', mode: '志愿服务' }
]
const PAGE_SIZE = 5

const ActivityPage: React.FC = () => {
  const [module, setModule] = useState<'activity' | 'profile'>('activity')
  const [tab, setTab] = useState<'on' | 'off'>('on')
  const [page, setPage] = useState(1)

  const { list, totalPage } = useMemo(() => {
    if (module !== 'activity') return { list: [], totalPage: 1 }
    const source = tab === 'on' ? allOnShelf : allOffShelf
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return {
      list: source.slice(start, end),
      totalPage: Math.max(1, Math.ceil(source.length / PAGE_SIZE))
    }
  }, [module, tab, page])

  return (
    <View className='min-h-screen bg-[#f5f7fa]'>
      <View className='flex bg-white px-8 py-6 shadow-sm'>
        <Image
          src=''
          className='h-[112rpx] w-[112rpx] rounded-full bg-gray-200'
        />
        <View className='ml-8 flex-1'>
          <Text className='text-[32rpx] font-semibold text-[#222222]'>
            Your-name
          </Text>
          <View className='mt-6 flex overflow-x-auto whitespace-nowrap'>
            <View className='mr-12 inline-flex items-center'>
              <Text className='mr-3 text-[24rpx] text-[#666666]'>信息管理</Text>
              <Text
                className={`rounded-full px-4 py-1 text-[28rpx] text-[#666666] ${
                  module === 'activity'
                    ? 'bg-[#1890ff] font-semibold text-white'
                    : ''
                }`}
                onClick={() => {
                  setModule('activity')
                  setPage(1)
                }}
              >
                活动信息
              </Text>
            </View>
            <View className='inline-flex items-center'>
              <Text className='mr-3 text-[24rpx] text-[#666666]'>用户管理</Text>
              <Text
                className={`rounded-full px-4 py-1 text-[28rpx] text-[#666666] ${
                  module === 'profile'
                    ? 'bg-[#1890ff] font-semibold text-white'
                    : ''
                }`}
                onClick={() => {
                  setModule('profile')
                  setPage(1)
                }}
              >
                个人信息
              </Text>
            </View>
          </View>
        </View>
      </View>

      {module === 'activity' ? (
        <View className='mx-6 mt-6 flex min-h-[560rpx] flex-col rounded-2xl bg-white p-9 shadow-lg'>
          <View>
            <Text className='text-[34rpx] font-bold text-[#222222]'>
              活动信息
            </Text>
            <View className='mt-5 flex items-center justify-between'>
              <Text className='text-[26rpx] text-[#1890ff]'>缴纳保证金</Text>
              <Button
                className='ml-4 rounded-full bg-[#1890ff] px-6 py-2 text-[26rpx] text-white'
                size='mini'
              >
                + 发布赞助
              </Button>
            </View>
            <View className='mt-2 flex items-center text-[24rpx]'>
              <Text className='text-[#ff8c00]'>banner推荐</Text>
              <Text className='mx-2 text-[#cccccc]'>|</Text>
              <Text className='text-[#ff8c00]'>首页展示</Text>
            </View>
          </View>

          <View className='mt-9 flex items-center text-[28rpx]'>
            <Text
              className={`rounded px-4 py-2 text-[#666666] ${
                tab === 'on'
                  ? 'border-b-4 border-[#1890ff] font-semibold text-[#1890ff]'
                  : ''
              }`}
              onClick={() => {
                setTab('on')
                setPage(1)
              }}
            >
              已上架信息({allOnShelf.length})
            </Text>
            <Text className='mx-5 text-[#cccccc]'>|</Text>
            <Text
              className={`rounded px-4 py-2 text-[#666666] ${
                tab === 'off'
                  ? 'border-b-4 border-[#1890ff] font-semibold text-[#1890ff]'
                  : ''
              }`}
              onClick={() => {
                setTab('off')
                setPage(1)
              }}
            >
              未上架信息({allOffShelf.length})
            </Text>
          </View>

          <View className='mt-7 flex flex-col items-center'>
            <View className='min-h-[460rpx] w-full text-[26rpx]'>
              <View className='grid grid-cols-[4fr_2fr_2fr_2fr] rounded-t-lg bg-[#e6f4ff] font-semibold text-[#222222]'>
                <Text className='px-4 py-5 text-left'>活动信息</Text>
                <Text className='px-4 py-5 text-center'>活动类型</Text>
                <Text className='px-4 py-5 text-center'>赞助形式</Text>
                <Text className='px-4 py-5 text-center'>操作</Text>
              </View>

              {list.length === 0 ? (
                <View className='py-40 text-center text-[28rpx] text-[#999999]'>
                  暂无数据
                </View>
              ) : (
                list.map((item, index) => (
                  <View
                    className={`grid grid-cols-[4fr_2fr_2fr_2fr] items-center border-b border-[#eaeaea] px-0 ${
                      index % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'
                    }`}
                    key={item.id}
                  >
                    <Text className='truncate px-4 py-6 text-left text-[#222222]'>
                      {item.title}
                    </Text>
                    <Text className='px-4 py-6 text-center text-[#222222]'>
                      {item.type}
                    </Text>
                    <Text className='px-4 py-6 text-center text-[#222222]'>
                      {item.mode}
                    </Text>
                    <View className='flex items-center justify-center gap-2 px-4 py-6 text-center'>
                      <Text className='text-[#1890ff]'>编辑</Text>
                      <Text className='text-[#cccccc]'>|</Text>
                      <Text className='text-[#1890ff]'>
                        {tab === 'on' ? '下架' : '上架'}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <AtPagination
              className='mt-8 flex justify-center text-[26rpx]'
              icon
              total={totalPage * PAGE_SIZE}
              pageSize={PAGE_SIZE}
              current={page}
              onPageChange={(e) => setPage(e.current)}
            />
          </View>
        </View>
      ) : (
        <View className='mx-6 mt-6 flex min-h-[560rpx] flex-col items-center justify-center rounded-2xl bg-white p-12 text-[28rpx] text-[#666666] shadow-lg'>
          <Text>个人信息占位</Text>
        </View>
      )}
    </View>
  )
}

export default ActivityPage
