import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";

export default function Register() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View>
      <Text>SignUpPage</Text>
    </View>
  );
}
