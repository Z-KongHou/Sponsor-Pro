export interface info {
  id: number
  title: string
  type: string
  categories?: string
  position?: string
  time_from: string
  time_end: string
  amount: number
  description?: string
  initiatorId: number
  receiverId?: number
}

export interface detailInfo {
  id: number
  title: string
  type: string
  categories?: string
  position?: string
  time_from: string
  time_end: string
  amount: number
  description?: string
  initiatorId: number
  receiverId?: number
  initiatorIdToUser: {
    id: number
    avatarUrl?: string
    email: string
    name: string
    phone: string
    role: string
  }
}
