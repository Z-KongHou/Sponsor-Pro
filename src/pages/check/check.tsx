import { View, Button } from '@tarojs/components'
import { checkSponsorInfo } from '@/router/api'

export default function Check() {
  return (
    <View>
      <Button
        onClick={() => {
          checkSponsorInfo(0)
        }}
      ></Button>
    </View>
  )
}
