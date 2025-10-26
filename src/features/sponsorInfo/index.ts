import { createSlice } from '@reduxjs/toolkit'

const sponsorInfoSlice = createSlice({
  name: 'sponsorInfo',
  initialState: {},
  reducers: {
    setSponsorInfo: (state, action) => {
      state[action.payload.key] = action.payload.value
    }
  }
})

export const { setSponsorInfo } = sponsorInfoSlice.actions
export default sponsorInfoSlice.reducer
