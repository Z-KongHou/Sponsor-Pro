import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { info } from "../../interface/sponsorInfo"

interface ListItemProps {
  data: info;
}

export default function ListItem({ data }: ListItemProps){
  
  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      {/* 学校信息 */}
      <Text className="text-lg font-bold text-gray-800 mb-1 block">{data.name}</Text>
      <Text className="text-sm text-gray-500 mb-2 block">{data.school}</Text>
      
      {/* 基本信息 */}
      <View className="flex flex-wrap gap-2 mb-3">
        <View className="bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs">
          {data.categories}
        </View>
        <View className="bg-green-50 px-2 py-1 rounded text-green-700 text-xs">
          {data.position}
        </View>
      </View>
      
      {/* 时间范围 */}
      <View className="flex items-center text-sm text-gray-500 mb-3">
        <Text>时间:</Text>
        <Text className="ml-1">{data.time_from} 至 {data.time_end}</Text>
      </View>
      
      {/* 赞助金额 */}
      {data.value !== undefined && (
        <View className="mt-2">
          <View className="flex justify-between items-center">
            <Text className="text-base font-medium text-gray-800">
              赞助金额: <Text className="text-blue-600">{data.value.toLocaleString()}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}