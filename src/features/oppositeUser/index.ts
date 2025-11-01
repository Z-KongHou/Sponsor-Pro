import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatarUrl?: string
}

const initialState: UserProfile = {
  id: '',
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
      if (!state.id) {
        state = {
          id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          ...action.payload
        }
      } else {
        state = { ...state, ...action.payload }
      }
    },

    clearUserProfile: () => initialState
  }
})

export const { setUserInfo, clearUserProfile } = userSlice.actions

export default userSlice.reducer
