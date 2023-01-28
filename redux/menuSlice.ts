import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface Menu_config {
  popoverOpen: boolean
  dateIndex: number
  dateRange: [Date | null, Date | null]
}

const initialState: Menu_config = {
  popoverOpen: false,
  dateIndex: -1,
  dateRange: [null, null],
}

export const menuSlice = createSlice({
  name: "menuStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setDateRange: (state, action: PayloadAction<any>) => {
      state.dateRange = action.payload
    },
    setDateIndex: (state, action: PayloadAction<any>) => {
      state.dateIndex = action.payload
    },
    setOpenPopover: (state, action: PayloadAction<any>) => {
      state.popoverOpen = action.payload
    },
  },
})

export const { setDateRange, setOpenPopover, setDateIndex } = menuSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const popoverOpen = (state: AppState) => state.menuSlice.popoverOpen
export const dateIndex = (state: AppState) => state.menuSlice.dateIndex
export const dateRange = (state: AppState) => state.menuSlice.dateRange

export default menuSlice.reducer
