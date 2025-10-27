import { View, Text, Input, Textarea, Picker, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { createSponsor } from '@/router/api'
import RequireAuth from "@/components/requireAuth"

const types = [
  { label: '校方发起', value: 'SCHOOL_INITIATED' },
  { label: '企业发起', value: 'COMPANY_INITIATED' }
]

function Publish() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [typeIdx, setTypeIdx] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title) {
      Taro.showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    setSubmitting(true)
    try {
      await createSponsor({
        title,
        description,
        amount: amount ? Number(amount) : undefined,
        type: types[typeIdx].value
      })
      Taro.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className='min-h-screen bg-gray-50 p-4'>
      <View className='space-y-4 rounded-xl bg-white p-4 shadow'>
        <View>
          <Text className='mb-2 block text-sm text-gray-600'>标题</Text>
          <Input
            className='rounded border border-gray-200 p-2'
            placeholder='请输入赞助标题'
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>

        <View>
          <Text className='mb-2 block text-sm text-gray-600'>赞助类型</Text>
          <Picker
            mode='selector'
            range={types.map((t) => t.label)}
            value={typeIdx}
            onChange={(e) => setTypeIdx(Number(e.detail.value))}
          >
            <View className='rounded border border-gray-200 p-2'>
              {types[typeIdx].label}
            </View>
          </Picker>
        </View>

        <View>
          <Text className='mb-2 block text-sm text-gray-600'>预算(元)</Text>
          <Input
            type='number'
            className='rounded border border-gray-200 p-2'
            placeholder='可不填'
            value={amount}
            onInput={(e) => setAmount(e.detail.value)}
          />
        </View>

        <View>
          <Text className='mb-2 block text-sm text-gray-600'>详情描述</Text>
          <Textarea
            className='min-h-[160rpx] rounded border border-gray-200 p-2'
            placeholder='请输入赞助需求、时间地点、联系信息等'
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>

        <Button
          className='mt-2 rounded bg-blue-600 py-3 text-white disabled:opacity-60'
          disabled={submitting}
          onClick={handleSubmit}
        >
          提交发布
        </Button>
      </View>
    </View>
  )
}

export default function PublishSponsor(){
  return (
    <RequireAuth>
      <Publish />
    </RequireAuth>
  )
}