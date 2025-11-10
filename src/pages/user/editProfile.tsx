import { View, Text, Input, Button } from '@tarojs/components'
import Taro, { useUnload } from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { updateUserInfo } from '@/router/api'
import { useAppDispatch } from '@/app/hooks'
import { updateUserProfile } from '@/features/user'
import { useUserProfile } from './hook'

export default function EditProfile() {
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const dirtyRef = useRef(false)
  const { profile, status, refresh } = useUserProfile()

  useEffect(() => {
    if (status === 'succeeded') {
      setName(profile.name || '')
      setEmail(profile.email || '')
      setPhone(profile.phone || '')
      dirtyRef.current = false
    } else if (status === 'failed') {
      void refresh()
    }
  }, [status, profile.name, profile.email, profile.phone, refresh])

  const handleChange = (setter: (v: string) => void) => (e) => {
    setter(e.detail.value)
    dirtyRef.current = true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await updateUserInfo({ name, email, phone })
      dispatch(updateUserProfile({ name, email, phone }))
      dirtyRef.current = false
      Taro.showToast({ title: '已保存', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 400)
    } catch {
      // 已统一错误提示
    } finally {
      setSubmitting(false)
    }
  }

  useUnload(() => {
    // 返回上一页时自动保存
    if (dirtyRef.current && !submitting) {
      // 触发异步保存，不阻塞卸载
      updateUserInfo({ name, email, phone }).finally(() => {
        dispatch(updateUserProfile({ name, email, phone }))
        dirtyRef.current = false
      })
    }
  })

  return (
    <View className='min-h-screen bg-gray-50 p-4'>
      <View className='space-y-4 rounded-xl bg-white p-4 shadow'>
        <View>
          <Text className='mb-2 block text-sm text-gray-600'>姓名</Text>
          <Input
            className='rounded border border-gray-200 p-2'
            placeholder='请输入姓名'
            value={name}
            onInput={handleChange(setName)}
          />
        </View>

        <View>
          <Text className='mb-2 block text-sm text-gray-600'>邮箱</Text>
          <Input
            type='text'
            className='rounded border border-gray-200 p-2'
            placeholder='请输入邮箱'
            value={email}
            onInput={handleChange(setEmail)}
          />
        </View>

        <View>
          <Text className='mb-2 block text-sm text-gray-600'>电话</Text>
          <Input
            type='number'
            className='rounded border border-gray-200 p-2'
            placeholder='请输入手机号'
            value={phone}
            onInput={handleChange(setPhone)}
          />
        </View>

        <Button
          className='mt-2 rounded bg-blue-600 py-3 text-white disabled:opacity-60'
          disabled={submitting}
          onClick={handleSubmit}
        >
          保存并返回
        </Button>
      </View>
    </View>
  )
}
