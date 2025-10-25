import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import { AtPagination } from 'taro-ui'
import { getSponsorInfoByUserID, getUserInfo } from '@/router/api'
import { UserInfo } from '@/router/type'
import { Activity } from './type'


// Mock数据，待后端完成接口后替换
const allOffShelf: Activity[] = [
  { id: 3, title: '公益植树', type: '公益', status: '' }
]

const ActivityPage: React.FC = () => {


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo()
        if (res?.role) {
          setUserInfo(res)
        }
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    }
    fetchUserInfo()
  }, [])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getSponsorInfoByUserID(userInfo?.id?.toString() || '')
        if (res) {
          setAllOnShelf(res)
        }
      } catch (error) {
        console.error('获取活动信息失败', error)
      }
    }
    fetchActivities()
  }, [userInfo?.id])



  //赞助记录换页


  return (
    <View className='min-h-screen bg-[#f5f7fa]'>
      <View className='flex bg-white px-8 py-6 shadow-sm'>
        <Image
          src=''
          className='h-[112rpx] w-[112rpx] rounded-full bg-gray-200'
        />
        <View className='ml-8 flex-1'>
          <Text className='font-semibold text-[#222222] text-[32rpx]'>
            {userInfo?.name}
          </Text>
          <View className='mt-6 flex overflow-x-auto whitespace-nowrap'>
            <View className='mr-12 inline-flex items-center'>
              <Text className='mr-3 text-[#666666] text-[24rpx]'>信息管理</Text>
              <Text
                className={`rounded-full px-4 py-1 text-[#666666] text-[28rpx] ${
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
              <Text className='mr-3 text-[#666666] text-[24rpx]'>用户管理</Text>
              <Text
                className={`rounded-full px-4 py-1 text-[#666666] text-[28rpx] ${
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
            <Text className='font-bold text-[#222222] text-[34rpx]'>
              活动信息
            </Text>
            <View className='mt-5 flex items-center justify-between'>
              <Text className='text-[#1890ff] text-[26rpx]'>缴纳保证金</Text>
              <Button
                className='ml-4 rounded-full bg-[#1890ff] px-6 py-2 text-[26rpx] text-white'
                size='mini'
                onClick={() => {
                  handleCreateSponsor()
                }}
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
                <View className='py-40 text-center text-[#999999] text-[28rpx]'>
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
                      {item.status}
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
        <View className='mx-6 mt-6 flex min-h-[560rpx] flex-col items-center justify-center rounded-2xl bg-white p-12 text-[#666666] text-[28rpx] shadow-lg'>
          <Text>个人信息占位</Text>
        </View>
      )}
    </View>
  )
}

export default ActivityPage
