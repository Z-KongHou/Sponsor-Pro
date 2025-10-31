import { store } from '@/app/store'

export const getUserIdForWs = () => {
  const senderId = store.getState().user.profile?.id || ''
  const receiverId = store.getState().opposite.profile?.id || ''
  return { receiverId, senderId }
}
