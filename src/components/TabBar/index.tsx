import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";

interface TabBarProps {
  current: string; // 当前选中的页面
}

export default function TabBar({ current }: TabBarProps) {
  // 导航栏点击事件
  const handleNavClick = (page: string) => {
    if (page === current) {
      return; // 已经在当前页面，不需要跳转
    }

    switch (page) {
      case 'home':
        Taro.redirectTo({ url: "/pages/index/index" });
        break;
      case 'activities':
        // 暂时显示提示，后续可以跳转到对应页面
        Taro.redirectTo({ url: "/pages/sponsor/schoolSponsor" });
        break;
      case 'sponsors':
        // 暂时显示提示，后续可以跳转到对应页面
        Taro.showToast({ title: "功能开发中", icon: "none" });
        break;
      case 'profile':
        // 暂时显示提示，后续可以跳转到对应页面
        Taro.showToast({ title: "功能开发中", icon: "none" });
        break;
    }
  };

  // 导航项配置
  const tabItems = [
    {
      key: 'home',
      text: '首页',
      icon: '首',
      active: current === 'home'
    },
    {
      key: 'activities',
      text: '学校活动',
      icon: '活',
      active: current === 'activities'
    },
    {
      key: 'sponsors',
      text: '企业赞助',
      icon: '企',
      active: current === 'sponsors'
    },
    {
      key: 'profile',
      text: '个人中心',
      icon: '我',
      active: current === 'profile'
    }
  ];

  return (
    <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <View className="flex justify-around items-center">
        {tabItems.map((item) => (
          <View 
            key={item.key}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              item.active ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleNavClick(item.key)}
          >
            <View 
              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                item.active 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300'
              }`}
            >
              <Text 
                className={`text-xs font-bold ${
                  item.active 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}
              >
                {item.icon}
              </Text>
            </View>
            <Text 
              className={`text-xs ${
                item.active 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-500'
              }`}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
} 