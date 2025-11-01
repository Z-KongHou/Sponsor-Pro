import { createSlice } from '@reduxjs/toolkit'
import { detailInfo } from '@/interface/sponsorInfo'

const sponsorInfoSlice = createSlice({
  name: 'sponsorInfo',
  initialState: {} as detailInfo,
  reducers: {
    setSponsorInfo: (state, action) => {
      return action.payload
    }
  }
})

export const { setSponsorInfo } = sponsorInfoSlice.actions
export default sponsorInfoSlice.reducer
