import { View, Text } from '@tarojs/components'
import { info } from '@/interface/sponsorInfo'

interface ListItemProps {
  data: info
}

export default function ListItem({ data }: ListItemProps) {
  return (
    <View className='mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
      {/* 学校信息 */}
      <Text className='mb-1 block text-lg font-bold text-gray-800'>
        {data.title}
      </Text>

      {/* 基本信息 */}
      <View className='mb-3 flex flex-wrap gap-2'>
        <View className='rounded bg-blue-50 px-2 py-1 text-xs text-blue-700'>
          {data.categories}
        </View>
        <View className='rounded bg-green-50 px-2 py-1 text-xs text-green-700'>
          {data.position}
        </View>
      </View>

      {/* 时间范围 */}
      <View className='mb-3 flex items-center text-sm text-gray-500'>
        <Text>时间:</Text>
        <Text className='ml-1'>
          {data.time_from} 至 {data.time_end}
        </Text>
      </View>

      {/* 赞助金额 */}
      {data.amount !== undefined && (
        <View className='mt-2'>
          <View className='flex items-center justify-between'>
            <Text className='text-base font-medium text-gray-800'>
              赞助金额:{' '}
              <Text className='text-blue-600'>
                {data.amount.toLocaleString()}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
