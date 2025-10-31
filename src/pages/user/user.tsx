import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtPagination } from 'taro-ui'
import TabBar from '../../components/TabBar'
import { useSponsorPage } from './hook'
import FloatingActionButton from '../../components/SponsorButton'

const ActivityPage: React.FC = () => {
  const {
    loading,
    module,
    setModule,
    tab,
    setTab,
    page,
    setPage,
    profile,
    list,
    totalPage,
    pageSize,
    onShelfCount,
    offShelfCount,
    handleCreateSponsor
  } = useSponsorPage()

  return (
    <View className='min-h-screen bg-[#f5f7fa] pb-24 pt-20'>
      <View className='relative flex bg-white px-8 py-6 shadow-sm'>
        <Image
          src=''
          className='h-[112rpx] w-[112rpx] rounded-full bg-gray-200'
        />
        <View className='ml-8 flex-1'>
          <Text className='text-[32rpx] font-semibold text-[#222222]'>
            {profile.name || '-'}
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
            <View className='mt-5'>
              <Text className='text-[26rpx] text-[#1890ff]'>缴纳保证金</Text>
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
              }}
            >
              已上架信息(
              {onShelfCount})
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
              }}
            >
              未上架信息(
              {offShelfCount})
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

              {loading ? (
                <View className='py-40 text-center text-[28rpx] text-[#999999]'>
                  加载中...
                </View>
              ) : list.length === 0 ? (
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
              total={totalPage * pageSize}
              pageSize={pageSize}
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
              <Text className='font-medium text-[#222]'>
                {profile.name || '-'}
              </Text>
            </View>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>邮箱</Text>
              <Text className='font-medium text-[#222]'>
                {profile.email || '-'}
              </Text>
            </View>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>电话</Text>
              <Text className='font-medium text-[#222]'>
                {profile.phone || '-'}
              </Text>
            </View>
            <View className='flex items-center justify-between'>
              <Text className='text-[#888]'>角色</Text>
              <Text className='font-medium text-[#222]'>
                {profile.role || '-'}
              </Text>
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
      {module === 'activity' && (
        <FloatingActionButton
          text='发布赞助'
          bottomOffset={180}
          onClick={handleCreateSponsor}
        />
      )}
      <TabBar current='profile' />
    </View>
  )
}

export default ActivityPage
