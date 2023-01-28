import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface WatchlistForm_configs {
  name: string
  private: boolean
  selected_companies: Array<any>
}

const initialState: WatchlistForm_configs = {
  name: "",
  private: false,
  selected_companies: [],
}

export const watchlistFromSlice = createSlice({
  name: "watchlistFromStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setName: (state, action: PayloadAction<any>) => {
      state.name = action.payload
    },
    setPrivate: (state, action: PayloadAction<any>) => {
      state.private = action.payload
    },
    setSelectedCompanies: (state, action: PayloadAction<any>) => {
      state.selected_companies = action.payload
    },
    resetAll: (state) => {
      state.name = ""
      state.private = false
      state.selected_companies = []
    },
  },
})

export const { resetAll, setName, setPrivate, setSelectedCompanies } =
  watchlistFromSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const watchlistFromName = (state: AppState) =>
  state.watchlistFromSlice.name
export const watchlistFromSelectedItems = (state: AppState) =>
  state.watchlistFromSlice.selected_companies
export const watchlistFromPrivate = (state: AppState) =>
  state.watchlistFromSlice.private

export default watchlistFromSlice.reducer
