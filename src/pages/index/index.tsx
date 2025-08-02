import { View, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import ActivityPage from '../user/user';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    // <View>
    //   <Text onClick={() => Taro.navigateTo({ url: "/pages/register/index" })}>
    //     Hello world!
    //   </Text>
    // </View>
    <ActivityPage />
  );
}
