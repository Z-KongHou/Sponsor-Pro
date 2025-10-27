import { createSlice } from '@reduxjs/toolkit'

const oppositeSlice = createSlice({
  name: 'opposite',
  initialState: {},
  reducers: {
    setOpposite: (state, action) => {
      state[action.payload.key] = action.payload.value
    }
  }
})

export const { setOpposite } = oppositeSlice.actions
export default oppositeSlice.reducer
