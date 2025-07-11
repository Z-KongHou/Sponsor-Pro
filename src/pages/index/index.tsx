import { View, Text, Button } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <>
      <View>
        <Text>Hello world!</Text>
      </View>
      <Button
        onClick={() => {
          Taro.redirectTo({
            url: "/pages/login/index",
          });
        }}
      >
        login
      </Button>
      <Button
        onClick={() => {
          Taro.redirectTo({
            url: "/pages/register/index",
          });
        }}
      >
        register
      </Button>
    </>
  );
}
