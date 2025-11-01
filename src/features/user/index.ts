import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  role: string
  avatarUrl?: string
}

type UserStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface UserState {
  profile: UserProfile | null
  status: UserStatus
  error?: string
}

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: undefined
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStatus: (
      state,
      action: PayloadAction<{ status: UserStatus; error?: string }>
    ) => {
      state.status = action.payload.status
      state.error = action.payload.error
    },
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.status = 'succeeded'
      state.error = undefined
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<UserProfile>>
    ) => {
      if (!state.profile) {
        state.profile = {
          id: 0,
          name: '',
          email: '',
          phone: '',
          role: '',
          ...action.payload
        }
      } else {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    clearUserProfile: () => initialState
  }
})

export const {
  setUserStatus,
  setUserProfile,
  updateUserProfile,
  clearUserProfile
} = userSlice.actions

export default userSlice.reducer
