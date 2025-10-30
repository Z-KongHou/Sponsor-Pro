import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface FloatingActionButtonProps {
  text?: string
  onClick?: () => void
  bottomOffset?: number
}

const FloatingActionButton = ({
  text = '发布赞助',
  onClick = () => Taro.navigateTo({ url: '/pages/sponsor/publish' }),
  bottomOffset = 160
}: FloatingActionButtonProps) => {
  return (
    <View
      className='fixed right-6 z-50'
      style={{ bottom: `${bottomOffset}rpx` }}
    >
      <View
        className='flex items-center gap-0 rounded-full bg-[#2563eb] px-6 py-3 text-white shadow-lg'
        onClick={onClick}
      >
        <View className='flex h-3 w-3 items-center justify-center rounded-full bg-white/20'>
          <Text className='text-[28rpx] font-semibold leading-none'>＋</Text>
        </View>
        <Text className='text-[24rpx] font-medium'>{text}</Text>
      </View>
    </View>
  )
}

export default FloatingActionButton
