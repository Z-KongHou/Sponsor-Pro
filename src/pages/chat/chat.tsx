import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import ChatBox from '@/components/ChatBox'
import TabBar from '@/components/TabBar'

export default function Chat() {
  return (
    <View className='inline-block flex min-h-screen w-full flex-col gap-2 bg-[#F7F7F7] py-10'>
      <ChatBox
        user='Sender'
        content='dsahkmjdhasjkhdnasukhndjkasbdkjsahndjkashbdujksajbndkjasbdhjasjbdasbhdjasbdj'
      />
      <ChatBox user='Receiver' content='你好' />
      <Button
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/chat/privateChat'
          })
        }}
      >
        发送
      </Button>
      <TabBar current='chat' />
    </View>
  )
}
