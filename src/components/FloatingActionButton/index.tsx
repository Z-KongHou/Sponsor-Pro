import { Text, View } from '@tarojs/components'

interface FloatingActionButtonProps {
  text: string
  onClick: () => void
  bottomOffset?: number
}

const FloatingActionButton = ({
  text,
  onClick,
  bottomOffset = 20
}: FloatingActionButtonProps) => {
  return (
    <View className='fixed right-6 z-50' style={{ bottom: `${bottomOffset}rpx` }}>
      <View
        className='flex items-center gap-3 rounded-full bg-[#2563eb] px-8 py-4 text-white shadow-lg'
        onClick={onClick}
      >
        <View className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20'>
          <Text className='text-[32rpx] font-semibold leading-none'>＋</Text>
        </View>
        <Text className='text-[28rpx] font-medium'>{text}</Text>
      </View>
    </View>
  )
}

export default FloatingActionButton
