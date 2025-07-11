import { View, Text } from "@tarojs/components";
import { useLoad,navigateTo } from "@tarojs/taro";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View>
      <Text onClick={() => navigateTo({ url: '/pages/register/index' })}>Hello world!</Text>
    </View>
  );
}
