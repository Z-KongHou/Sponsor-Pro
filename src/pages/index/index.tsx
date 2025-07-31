import { View, Text } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { getWeChatInfo } from "../../router/api"

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });
  const wxLogin = () => {
    // 获取微信账户信息
    const accountInfo = Taro.getAccountInfoSync()
    Taro.login({
      success: function (res) {      
        console.log(res)                                                                                             
        if (res.code) {
          // 自己项目的接口，获取微信信息 为了拿到openid
          try {
            getWeChatInfo(res.code, accountInfo.miniProgram.appId).then((req) => {
              console.log(req);
              Taro.setStorageSync('longtoken', req.data.token);
              if (req.data.code == 200) {
                Taro.showToast({ title: "登录成功" })
                // Taro.navigateTo({ url: "/pages/home/index" })    
              }
              else if (req.data.code == 206) {
                Taro.showToast({ title: "用户不存在" })
                Taro.navigateTo({ url: "/pages/register/index" })
              }
            });
          } catch (error) {
            console.error('获取微信信息失败:', error);
            Taro.showToast({ title: '获取用户信息失败', icon: 'none' });
          }
        } else {
          Taro.showToast({ title: "登录失败" })
          Taro.navigateTo({ url: "/pages/register/index" })
        }
      },
    })
  }

  return (
    <View>
      <Text onClick={() => Taro.navigateTo({ url: "/pages/register/index" })}>
        Hello world!
      </Text>
      <Text onClick={() => wxLogin()}>
        登录
      </Text>
    </View>
  );
}
