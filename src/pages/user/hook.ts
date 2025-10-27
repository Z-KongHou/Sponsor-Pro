import {
  deleteSponsor,
  getSponsorInfoByUserID,
  getUserInfo,
  updateSponsorStatus
} from '@/router/api'
import Taro from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity } from './type'

const PAGE_SIZE = 5

const isActivityOnShelf = (status?: string) => {
  const normalized = (status || '').toUpperCase()
  return ['APPROVED', 'COMPLETED'].includes(normalized)
}

const splitSponsors = (activities: Activity[]) => {
  const on: Activity[] = []
  const off: Activity[] = []

  activities.forEach((item) => {
    if (isActivityOnShelf(item.status)) {
      on.push(item)
    } else {
      off.push(item)
    }
  })

  return { on, off }
}

const normalizeSponsorResponse = (payload: unknown): Activity[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as Activity[]

  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>
    const directList = data.sponsorships
    if (Array.isArray(directList)) return directList as Activity[]

    const nested = data.data
    if (Array.isArray(nested)) return nested as Activity[]

    if (nested && typeof nested === 'object') {
      const nestedRecord = nested as Record<string, unknown>
      const nestedList = nestedRecord.sponsorships
      if (Array.isArray(nestedList)) return nestedList as Activity[]
    }
  }

  return []
}

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

const useUserProfile = () => {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: ''
  })

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getUserInfo()
      const user =
        response &&
        typeof response === 'object' &&
        'user' in response &&
        typeof (response as { user: unknown }).user === 'object'
          ? ((response as { user: Record<string, unknown> }).user ?? undefined)
          : undefined
      const target: Record<string, unknown> =
        (user && typeof user === 'object'
          ? (user as Record<string, unknown>)
          : response && typeof response === 'object'
          ? (response as Record<string, unknown>)
          : {}) as Record<string, unknown>

      setProfile({
        id: target?.id ? String(target.id) : '',
        name: (target?.name as string) || '',
        email: (target?.email as string) || '',
        phone: (target?.phone as string) || '',
        role: (target?.role as string) || ''
      })
    } catch (error) {
      Taro.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
      console.error('获取用户信息失败', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    loading,
    profile,
    refresh
  }
}

const useUserSponsorships = (userId: string) => {
  const [loading, setLoading] = useState(true)
  const [allActivities, setAllActivities] = useState<Activity[]>([])

  const refresh = useCallback(async () => {
    if (!userId) {
      setAllActivities([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await getSponsorInfoByUserID(userId)
      setAllActivities(normalizeSponsorResponse(data))
    } catch (error) {
      Taro.showToast({
        title: '获取赞助记录失败',
        icon: 'none'
      })
      console.error('获取赞助记录失败', error)
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
  const [module, setModule] = useState<'activity' | 'profile'>('activity')
  const [tab, setTab] = useState<'on' | 'off'>('on')
  const [page, setPage] = useState(1)

  const {
    loading: profileLoading,
    profile,
    refresh: refreshProfile
  } = useUserProfile()
  const {
    loading: sponsorLoading,
    onShelf,
    offShelf,
    refresh: refreshSponsorships
  } = useUserSponsorships(profile.id)

  const { list, totalPage } = useMemo(() => {
    if (module !== 'activity') return { list: [] as Activity[], totalPage: 1 }
    const source = tab === 'on' ? onShelf : offShelf
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    return {
      list: source.slice(start, end),
      totalPage: Math.max(1, Math.ceil(source.length / PAGE_SIZE))
    }
  }, [module, tab, page, onShelf, offShelf])

  useEffect(() => {
    setPage(1)
  }, [module, tab])

  const handleCreateSponsor = () => {
    Taro.navigateTo({ url: '/pages/sponsor/publish' })
  }

  const handleUpdateStatus = useCallback(
    async (id: number, operation: boolean) => {
      try {
        await updateSponsorStatus(id, operation)
        await refreshSponsorships()
      } catch (error) {
        console.error('更新状态失败', error)
        Taro.showToast({
          title: '更新状态失败',
          icon: 'none'
        })
      }
    },
    [refreshSponsorships]
  )

  const handleDeleteSponsor = useCallback(
    (sponsorId: number) => {
      Taro.showModal({
        title: '确认删除',
        content: '确定要删除该赞助吗？',
        success: (res) => {
          if (res.confirm) {
            deleteSponsor(sponsorId)
              .then(async () => {
                Taro.showToast({ title: '删除成功', icon: 'success' })
                await refreshSponsorships()
              })
              .catch((error) => {
                console.error('删除赞助失败', error)
                Taro.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              })
          }
        }
      })
    },
    [refreshSponsorships]
  )

  return {
    loading: profileLoading || sponsorLoading,
    module,
    setModule,
    tab,
    setTab,
    page,
    setPage,
    profile,
    onShelfCount: onShelf.length,
    offShelfCount: offShelf.length,
    list,
    totalPage,
    pageSize: PAGE_SIZE,
    refreshProfile,
    refreshSponsorships,
    handleCreateSponsor,
    handleUpdateStatus,
    handleDeleteSponsor
  }
}

export {
  PAGE_SIZE,
  useSponsorPage,
  useUserProfile,
  useUserSponsorships
}
