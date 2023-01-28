import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface WorkspaceForm_configs {
  name: string
  description: string
  private: boolean
  user_default: boolean
  global_default: boolean
  watchlist: boolean
  relative_date: boolean
}

const initialState: WorkspaceForm_configs = {
  name: "",
  description: "",
  private: false,
  user_default: false,
  global_default: false,
  watchlist: false,
  relative_date: false,
}

export const workspaceFormSlice = createSlice({
  name: "workspaceFromStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRelativeDate: (state, action: PayloadAction<any>) => {
      state.relative_date = action.payload
    },
    setName: (state, action: PayloadAction<any>) => {
      state.name = action.payload
    },
    setDescription: (state, action: PayloadAction<any>) => {
      state.description = action.payload
    },
    setPrivate: (state, action: PayloadAction<any>) => {
      state.private = action.payload
    },
    setUserDefault: (state, action: PayloadAction<any>) => {
      state.user_default = action.payload
    },
    setGlobalDefault: (state, action: PayloadAction<any>) => {
      state.global_default = action.payload
    },
    setWatchlist: (state, action: PayloadAction<any>) => {
      state.watchlist = action.payload
    },
    workspaceFormReset: (state) => {
      state.name = ""
      state.description = ""
      state.private = false
      state.user_default = false
      state.global_default = false
      state.watchlist = false
    },
  },
})

export const {
  setName,
  setDescription,
  setPrivate,
  setUserDefault,
  setGlobalDefault,
  setWatchlist,
  setRelativeDate,
  workspaceFormReset,
} = workspaceFormSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const workspaceFormRelativeDate = (state: AppState) =>
  state.workspaceFormSlice.relative_date
export const workspaceForm = (state: AppState) => state.workspaceFormSlice.name
export const workspaceFormName = (state: AppState) =>
  state.workspaceFormSlice.name
export const workspaceFormDescription = (state: AppState) =>
  state.workspaceFormSlice.description
export const workspaceFormPrivate = (state: AppState) =>
  state.workspaceFormSlice.private
export const workspaceFormUserDefault = (state: AppState) =>
  state.workspaceFormSlice.user_default
export const workspaceFormGlobalDefault = (state: AppState) =>
  state.workspaceFormSlice.global_default
export const workspaceFormWatchlist = (state: AppState) =>
  state.workspaceFormSlice.watchlist

export default workspaceFormSlice.reducer
