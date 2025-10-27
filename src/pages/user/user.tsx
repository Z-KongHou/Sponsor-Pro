import { View, Text, Image, Button } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import { AtPagination } from 'taro-ui'
import Taro from '@tarojs/taro'
import { getUserInfo, getSponsorInfoByUserID } from '@/router/api'

interface Activity {
  id: number
  title: string
  type: string
  status?: string
}
const PAGE_SIZE = 5

const ActivityPage: React.FC = () => {
  const [module, setModule] = useState<'activity' | 'profile'>('activity')
  const [tab, setTab] = useState<'on' | 'off'>('on')
  const [page, setPage] = useState(1)

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [role, setRole] = useState<string>('')
  // const [actionOpen, setActionOpen] = useState(false)
  const [allActivities, setAllActivities] = useState<Activity[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const profile = await getUserInfo()
        const u = profile?.user
        if (u) {
          setName(u.name || '')
          setEmail(u.email || '')
          setPhone(u.phone || '')
          setRole(u.role || '')
        }
        const uid = u?.id
        if (uid) {
          const res = await getSponsorInfoByUserID(uid)
          const list =
            res?.data?.sponsorships || res?.sponsorships || res?.data || []
          setAllActivities(list)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  // 赞助记录换页（使用真实数据）
  const { list, totalPage } = useMemo(() => {
    if (module !== 'activity') return { list: [], totalPage: 1 }
    const onShelf = allActivities.filter((a) =>
      ['APPROVED', 'COMPLETED'].includes((a.status || '').toUpperCase())
    )
    const offShelf = allActivities.filter(
      (a) => !['APPROVED', 'COMPLETED'].includes((a.status || '').toUpperCase())
    )
    const source = tab === 'on' ? onShelf : offShelf
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return {
      list: source.slice(start, end),
      totalPage: Math.max(1, Math.ceil(source.length / PAGE_SIZE))
    }
  }, [module, tab, page])

  useEffect(() => {
    setPage(1)
  }, [module, tab])
  return (
    <View className='min-h-screen bg-[#f5f7fa]'>
      <View className='relative flex bg-white px-8 py-6 shadow-sm'>
        <Image
          src=''
          className='h-[112rpx] w-[112rpx] rounded-full bg-gray-200'
        />
        <View className='ml-8 flex-1'>
          <Text className='text-[32rpx] font-semibold text-[#222222]'>
            {name}
          </Text>
          <View className='mt-6 flex justify-center gap-10'>
            <Text
              className={`select-none whitespace-nowrap rounded-full px-6 py-2 text-[28rpx] ${
                module === 'activity'
                  ? 'bg-[#1890ff] font-semibold text-white'
                  : 'border border-[#eaeaea] text-[#666666]'
              }`}
              onClick={() => {
                setModule('activity')
                setPage(1)
              }}
            >
              活动信息
            </Text>
            <Text
              className={`select-none whitespace-nowrap rounded-full px-6 py-2 text-[28rpx] ${
                module === 'profile'
                  ? 'bg-[#1890ff] font-semibold text-white'
                  : 'border border-[#eaeaea] text-[#666666]'
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
                onClick={() =>
                  Taro.navigateTo({ url: '/pages/sponsor/publish' })
                }
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
              已上架信息(
              {
                allActivities.filter((a) =>
                  ['APPROVED', 'COMPLETED'].includes(
                    (a.status || '').toUpperCase()
                  )
                ).length
              }
              )
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
              未上架信息(
              {
                allActivities.filter(
                  (a) =>
                    !['APPROVED', 'COMPLETED'].includes(
                      (a.status || '').toUpperCase()
                    )
                ).length
              }
              )
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
                      {item.status || '-'}
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
        <View className='mx-6 mt-6 rounded-2xl bg-white p-9 text-[28rpx] text-[#333] shadow-lg'>
          <Text className='mb-6 block text-[34rpx] font-bold'>个人信息</Text>

          <View className='space-y-4'>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>姓名</Text>
              <Text className='font-medium text-[#222]'>{name || '-'}</Text>
            </View>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>邮箱</Text>
              <Text className='font-medium text-[#222]'>{email || '-'}</Text>
            </View>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>电话</Text>
              <Text className='font-medium text-[#222]'>{phone || '-'}</Text>
            </View>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>角色</Text>
              <Text className='font-medium text-[#222]'>{role || '-'}</Text>
            </View>
          </View>

          <View className='mt-8 flex justify-end'>
            <Button
              className='rounded bg-[#1890ff] px-6 py-2 text-[26rpx] text-white'
              onClick={() =>
                Taro.navigateTo({ url: '/pages/user/editProfile' })
              }
            >
              编辑个人资料
            </Button>
          </View>
        </View>
      )}
      <View className='fixed bottom-8 right-8 z-50'>
        <Button
          className='rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg'
          onClick={() => Taro.navigateTo({ url: '/pages/sponsor/publish' })}
        >
          + 发布赞助
        </Button>
      </View>
    </View>
  )
}

export default ActivityPage
