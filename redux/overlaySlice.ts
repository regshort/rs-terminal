import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface Overlay_configs {
  workspace: boolean
  workspacePublic: boolean
  watchlist: boolean
  watchlistPublic: boolean
  settings: boolean
}

const initialState: Overlay_configs = {
  workspace: false,
  workspacePublic: false,
  watchlist: false,
  watchlistPublic: false,
  settings: false,
}

export const overlaySlice = createSlice({
  name: "overlayStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setWorkspacePublicOverlay: (state, action: PayloadAction<any>) => {
      state.workspacePublic = action.payload
    },
    setWatchlistPublicOverlay: (state, action: PayloadAction<any>) => {
      state.watchlistPublic = action.payload
    },
    setSettingsOverlay: (state, action: PayloadAction<any>) => {
      state.settings = action.payload
    },
    setWorkspaceOverlay: (state, action: PayloadAction<any>) => {
      state.workspace = action.payload
    },
    setWatchlistOverlay: (state, action: PayloadAction<any>) => {
      state.watchlist = action.payload
    },
  },
})

export const {
  setWorkspaceOverlay,
  setWatchlistOverlay,
  setSettingsOverlay,
  setWatchlistPublicOverlay,
  setWorkspacePublicOverlay,
} = overlaySlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const watchlistPublicOverlay = (state: AppState) =>
  state.overlaySlice.watchlistPublic
export const workspacePublicOverlay = (state: AppState) =>
  state.overlaySlice.workspacePublic
export const workspaceOverlay = (state: AppState) =>
  state.overlaySlice.workspace
export const watchlistOverlay = (state: AppState) =>
  state.overlaySlice.watchlist
export const settingsOverlay = (state: AppState) => state.overlaySlice.settings

export default overlaySlice.reducer
