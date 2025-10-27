import { deleteSponsor, getSponsorInfoByUserID, updateSponsorStatus } from '@/router/api'
import Taro from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity } from './type'

const PAGE_SIZE = 5

const splitSponsors = (activities: Activity[]) => {
  const on: Activity[] = []
  const off: Activity[] = []

  activities.forEach((item) => {
    if (item.status !== 'REJECTED') {
      on.push(item)
    } else {
      off.push(item)
    }
  })

  return { on, off }
}

const useUserInfo = () => {
  const id = Taro.getStorageSync('userId') as string
  return { id }
}

const useUserSponsorships = (userId: string) => {
  const [loading, setLoading] = useState(true)
  const [allActivities, setAllActivities] = useState<Activity[]>([])

  const refresh = useCallback(async () => {
    if (!userId) return

    setLoading(false)
    try {
      const data = await getSponsorInfoByUserID(userId)
      setAllActivities(data)
    } catch (error) {
      Taro.showToast({
        title: '获取赞助记录失败',
        icon: 'none'
      })
      console.error('获取用户信息失败', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const { on, off } = useMemo(
    () => splitSponsors(allActivities),
    [allActivities]
  )

  return {
    loading,
    onShelf: on,
    offShelf: off,
    refresh
  }
}

const useSponsorPage = () => {
  const [module, setModule] = useState<'activity' | 'profile'>('activity') // 当前模块
  const [tab, setTab] = useState<'on' | 'off'>('on') // 当前赞助记录标签页
  const [page, setPage] = useState(1) // 当前页码
  const userInfo = useUserInfo()

  // 获取用户赞助记录并分类
  const { loading, onShelf, offShelf, refresh } = useUserSponsorships(
    userInfo?.id
  )

  // 处理当前活动列表
  // const activeList = tab === 'on' ? onShelf : offShelf
  // 换页处理
  const { list, totalPage } = useMemo(() => {
    if (module !== 'activity') return { list: [], totalPage: 1 }
    const source = tab === 'on' ? onShelf : offShelf
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return {
      list: source.slice(start, end),
      totalPage: Math.max(1, Math.ceil(source.length / PAGE_SIZE))
    }
  }, [module, tab, page, onShelf, offShelf])

  // 创建赞助跳转
  const handleCreateSponsor = () => {
    Taro.showToast({
      title: '功能开发中，敬请期待！',
      icon: 'none'
    })
    // TODO: 创建赞助页面
    Taro.navigateTo({ url: '/src/pages/sponsor/create_sponsor/create_sponsor' })
  }

  // 更新赞助状态
  const handleUpdateStatus = useCallback(
    async (id: number, operation: boolean) => {
      try {
        await updateSponsorStatus(id, operation)
        await refresh()
      } catch (error) {
        console.error('更新状态失败', error)
      }
    },
    [refresh]
  )

  const handleDeleteSponsor = (sponsorId: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除该赞助吗？',
      success: (res) => {
        if (res.confirm) {
          deleteSponsor(sponsorId).then(async () => {
            Taro.showToast({ title: '删除成功', icon: 'success' })
            // 刷新页面或更新状态以反映删除
            await refresh()
          })
        }
      }
    })
  }

  // 页面切换逻辑如需使用可恢复

  return {
    loading,
    module,
    setModule,
    tab,
    setTab,
    page,
    setPage,
    userInfo,
    list,
    totalPage,
    handleCreateSponsor,
    handleUpdateStatus,
    handleDeleteSponsor
  }
}

export { useSponsorPage, useUserInfo, useUserSponsorships }
