import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  role: string
  avatarUrl?: string
}

const initialState: UserProfile = {
  id: 0,
  name: '',
  email: '',
  phone: '',
  role: '',
  avatarUrl: ''
}

const userSlice = createSlice({
  name: 'anotherUser',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Partial<UserProfile>>) => {
      return { ...state, ...action.payload }
    },
    clearUserProfile: () => initialState
  }
})

export const { setUserInfo, clearUserProfile } = userSlice.actions

export default userSlice.reducer
