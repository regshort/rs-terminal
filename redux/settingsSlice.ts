import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"
import { boolean } from "mathjs"

// properties available on the typed object
export interface Settings_config {
  wsStatus: string,
  showTickerMarquee: boolean
  marqueeSpeed: number
  appVersion: string
  userAgent: string
  changelog: any
  omni: boolean | null
  openWorkspace: boolean
  saveWorkspace: boolean
  saveWorkspaceAs: boolean
  newWorkspace: boolean,
  appStatus: any,
  screenshotMode: boolean
}

const initialState: Settings_config = {
  wsStatus: "loading",
  showTickerMarquee: false,
  marqueeSpeed: 36,
  appVersion: "0.0.0",
  userAgent: "",
  changelog: {},
  omni: false,
  openWorkspace: false,
  saveWorkspace: false,
  saveWorkspaceAs: false,
  newWorkspace: false,
  appStatus: {},
  screenshotMode: false,
}

export const settingsSlice = createSlice({
  name: "settingsStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setAppStatus: (state, action: PayloadAction<any>) => {
      state.appStatus = action.payload
    },
    setWsStatus: (state, action: PayloadAction<any>) => {
      state.wsStatus = action.payload
    },
    setNewWorkspace: (state, action: PayloadAction<any>) => {
      state.newWorkspace = action.payload
    },
    setSaveWorkspaceAs: (state, action: PayloadAction<any>) => {
      state.saveWorkspaceAs = action.payload
    },
    setSaveWorkspace: (state, action: PayloadAction<any>) => {
      state.saveWorkspace = action.payload
    },
    setOpenWorkspace: (state, action: PayloadAction<any>) => {
      state.openWorkspace = action.payload
    },
    setOmni: (state, action: PayloadAction<any>) => {
      state.omni = action.payload
    },
    setChangelog: (state, action: PayloadAction<any>) => {
      state.changelog = action.payload
    },
    setUserAgent: (state, action: PayloadAction<any>) => {
      state.userAgent = action.payload
    },
    setMarqueeSpeed: (state, action: PayloadAction<any>) => {
      state.marqueeSpeed = action.payload
    },
    setShowTickerMarquee: (state, action: PayloadAction<any>) => {
      state.showTickerMarquee = action.payload
    },
    setAppVersion: (state, action: PayloadAction<any>) => {
      state.appVersion = action.payload
    },
    setScreenshotMode: (state, action: PayloadAction<any>) => {
      state.screenshotMode = action.payload
    },
  },
})

export const {
  setAppStatus,
  setWsStatus,
  setMarqueeSpeed,
  setShowTickerMarquee,
  setAppVersion,
  setUserAgent,
  setChangelog,
  setOmni,
  setOpenWorkspace,
  setSaveWorkspace,
  setSaveWorkspaceAs,
  setNewWorkspace,
  setScreenshotMode
} = settingsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const showTickerMarquee = (state: AppState) =>
  state.settingsSlice.showTickerMarquee
export const marqueeSpeed = (state: AppState) =>
  state.settingsSlice.marqueeSpeed
export const appVersion = (state: AppState) => state.settingsSlice.appVersion
export const userAgent = (state: AppState) => state.settingsSlice.userAgent
export const changelog = (state: AppState) => state.settingsSlice.changelog
export const omni = (state: AppState) => state.settingsSlice.omni
export const openWorkspace = (state: AppState) =>
  state.settingsSlice.openWorkspace
export const saveWorkspace = (state: AppState) =>
  state.settingsSlice.saveWorkspace
export const saveWorkspaceAs = (state: AppState) =>
  state.settingsSlice.saveWorkspaceAs
export const newWorkspace = (state: AppState) =>
  state.settingsSlice.newWorkspace
export const wsStatus = (state: AppState) =>
  state.settingsSlice.wsStatus
  export const appStatus = (state: AppState) =>
  state.settingsSlice.appStatus
  export const screenshotMode = (state: AppState) =>
  state.settingsSlice.screenshotMode
export default settingsSlice.reducer
