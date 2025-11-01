import { View, Button } from '@tarojs/components'
import { checkSponsorInfo } from '@/router/api'

export default function Check() {
  return (
    <View className='min-h-screen bg-gray-50'>
      <Button
        className='rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600'
        onClick={() => {
          checkSponsorInfo(8)
        }}
      >
        检查赞助
      </Button>
    </View>
  )
}
