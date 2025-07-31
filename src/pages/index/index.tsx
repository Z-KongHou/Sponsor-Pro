import { View, Text } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
// import { getWeChatInfo } from "../../router/api"
export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });
  const wxLogin = () => {
    // 获取微信账户信息
    // const accountInfo = Taro.getAccountInfoSync()
    // Taro.login({
    //   success: function (res) {                                                                                                   
    //     if (res.code) {
    //       // 自己项目的接口，获取微信信息 为了拿到openid
    //       getWeChatInfo(res.code,accountInfo.miniProgram.appId)
    //         .then(res => {
    //           if (res.code === 'OK') {
    //             api.wxLogin({
    //                 appId: '',  //与后端协定字段，看实际业务是否需要
    //                 openId: res.data.openid
    //               })
    //               .then(res1 => {
    //                 if (res1.code === 'OK') {
    //                   //拿到用户信息与token
    //                   Taro.setStorageSync('Authorization', res1.data.token)
    //                   Taro.setStorageSync('userInfo', res1.data.user)
    //                 }
    //               })
    //           } else {
    //             Taro.showToast({
    //               title: res.message || '',
    //               icon: 'none',
    //               duration: 2000,
    //             })
    //           }
    //         })
    //     } else {
    //       Taro.showToast({ title: "请先完成注册" })
    //       Taro.navigateTo({ url: "/pages/register/index" })
    //     }
    //   },
    // })
  }

  return (
    <View>
      <Text onClick={() => Taro.navigateTo({ url: "/pages/register/index" })}>
        Hello world!
      </Text>
      <Text onClick={() => wxLogin()}>
        Hello world!
      </Text>
    </View>
  );
}
