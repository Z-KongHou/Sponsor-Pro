import { View, Text, Image, Button } from '@tarojs/components';
import { useState, useMemo } from 'react';
import { AtPagination } from 'taro-ui';
import './index.scss';

interface Activity {
  id: number;
  title: string;
  type: string;
  mode: string;
}

const allOnShelf: Activity[] = [
  { id: 1, title: '校园歌手大赛', type: '文体', mode: '物资' },
  { id: 2, title: '程序设计挑战', type: '学术', mode: '资金' },
];
const allOffShelf: Activity[] = [
  { id: 3, title: '公益植树', type: '公益', mode: '志愿服务' },
];
const PAGE_SIZE = 5;

const ActivityPage: React.FC = () => {
  const [module, setModule] = useState<'activity' | 'profile'>('activity');
  const [tab, setTab] = useState<'on' | 'off'>('on');
  const [page, setPage] = useState(1);

  const { list, totalPage } = useMemo(() => {
    if (module !== 'activity') return { list: [], totalPage: 1 };
    const source = tab === 'on' ? allOnShelf : allOffShelf;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return {
      list: source.slice(start, end),
      totalPage: Math.max(1, Math.ceil(source.length / PAGE_SIZE)),
    };
  }, [module, tab, page]);

  return (
    <View className='activity-page'>
      <View className='top-bar'>
        <Image src='' className='avatar' />
        <View className='profile-info'>
          <Text className='name'>Your-name</Text>
          <View className='top-nav'>
            <View className='nav-group'>
              <Text className='group-title'>信息管理</Text>
              <Text
                className={`nav-item ${module === 'activity' ? 'active' : ''}`}
                onClick={() => {
                  setModule('activity');
                  setPage(1);
                }}
              >
                活动信息
              </Text>
            </View>
            <View className='nav-group'>
              <Text className='group-title'>用户管理</Text>
              <Text
                className={`nav-item ${module === 'profile' ? 'active' : ''}`}
                onClick={() => {
                  setModule('profile');
                  setPage(1);
                }}
              >
                个人信息
              </Text>
            </View>
          </View>
        </View>
      </View>

      {module === 'activity' ? (
        <View className='content'>
          <View className='content-head'>
            <Text className='page-title'>活动信息</Text>
            <View className='action-group'>
              <Text className='deposit-link'>缴纳保证金</Text>
              <Button className='publish-btn' size='mini'>
                + 发布赞助
              </Button>
            </View>
            <View className='sub-links'>
              <Text className='orange-link'>banner推荐</Text>
              <Text className='split'>|</Text>
              <Text className='orange-link'>首页展示</Text>
            </View>
          </View>

          <View className='tabs'>
            <Text
              className={`tab ${tab === 'on' ? 'active' : ''}`}
              onClick={() => {
                setTab('on');
                setPage(1);
              }}
            >
              已上架信息({allOnShelf.length})
            </Text>
            <Text className='vertical-split'>|</Text>
            <Text
              className={`tab ${tab === 'off' ? 'active' : ''}`}
              onClick={() => {
                setTab('off');
                setPage(1);
              }}
            >
              未上架信息({allOffShelf.length})
            </Text>
          </View>

          <View className='table-wrapper'>
            <View className='table'>
              <View className='table-head'>
                <Text className='th flex4'>活动信息</Text>
                <Text className='th flex2 center'>活动类型</Text>
                <Text className='th flex2 center'>赞助形式</Text>
                <Text className='th flex2 center'>操作</Text>
              </View>

              {list.length === 0 ? (
                <View className='table-empty'>暂无数据</View>
              ) : (
                list.map((item) => (
                  <View className='table-row' key={item.id}>
                    <Text className='td flex4 ellipsis'>{item.title}</Text>
                    <Text className='td flex2 center'>{item.type}</Text>
                    <Text className='td flex2 center'>{item.mode}</Text>
                    <Text className='td flex2 center'>
                      <Text className='link'>编辑</Text>
                      <Text className='split'>|</Text>
                      <Text className='link'>
                        {tab === 'on' ? '下架' : '上架'}
                      </Text>
                    </Text>
                  </View>
                ))
              )}
            </View>

            <AtPagination
              icon
              total={totalPage * PAGE_SIZE}
              pageSize={PAGE_SIZE}
              current={page}
              onPageChange={(e) => setPage(e.current)}
            />
          </View>
        </View>
      ) : (
        <View className='content profile-placeholder'>
          <Text style={{ textAlign: 'center', marginTop: '200rpx' }}>
            个人信息占位
          </Text>
        </View>
      )}
    </View>
  );
};

export default ActivityPage;
