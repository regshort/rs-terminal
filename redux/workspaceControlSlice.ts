import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface WorkspaceControl_configs {
  active: {
    id: string | null
    name: string | null
    description: string | null
    workspace: {} | null
    watchlist: boolean | null
    default: boolean | null
    globalDefault: boolean | null
    private: boolean | null
    creator: string | null
    relativeDate: number | null
  }
  current_config: any | null
  changes: [] | null
  activeSetter: {} | null
  activeConfigSetter: {} | null
  query: {} | null
  data_selector: string | null
}

const initialState: WorkspaceControl_configs = {
  active: {
    id: null,
    name: null,
    description: null,
    workspace: null,
    watchlist: null,
    default: null,
    globalDefault: null,
    private: null,
    creator: null,
    relativeDate: null,
  },
  current_config: null,
  changes: null,
  activeSetter: null,
  activeConfigSetter: null,
  query: null,
  data_selector: null,
}

export const workspaceControlSlice = createSlice({
  name: "workspaceControlStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    WSC_setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload
    },
    WSC_setActive: (state, action: PayloadAction<any>) => {
      state.activeSetter = action.payload
      state.active = action.payload
    },
    WSC_setConfigSetter: (state, action: PayloadAction<any>) => {
      state.activeConfigSetter = action.payload
    },
    WSC_setActiveSetterOnly: (state, action: PayloadAction<any>) => {
      state.activeSetter = action.payload
    },
    WSC_setCurrentConfig: (state, action: PayloadAction<any>) => {
      state.current_config = action.payload
    },
    WSC_setChanges: (state, action: PayloadAction<any>) => {
      state.changes = action.payload
    },
    WSC_setActiveName: (state, action: PayloadAction<any>) => {
      state.active.name = action.payload
    },
    WSC_setActiveDescription: (state, action: PayloadAction<any>) => {
      state.active.description = action.payload
    },
    WSC_setDataSelector: (state, action: PayloadAction<any>) => {
      state.data_selector = action.payload
    },
  },
})

export const {
  WSC_setActive,
  WSC_setConfigSetter,
  WSC_setCurrentConfig,
  WSC_setChanges,
  WSC_setActiveSetterOnly,
  WSC_setQuery,
  WSC_setActiveName,
  WSC_setActiveDescription,
  WSC_setDataSelector,
} = workspaceControlSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const WSC_Query =

export const WSC_Query = (state: AppState) => state.workspaceControlSlice.query
export const WSC_Active = (state: AppState) =>
  state.workspaceControlSlice.active
export const WSC_CurrentConfig = (state: AppState) =>
  state.workspaceControlSlice.current_config
export const WSC_Changes = (state: AppState) =>
  state.workspaceControlSlice.changes
export const WSC_ActiveSetter = (state: AppState) =>
  state.workspaceControlSlice.activeSetter
export const WSC_ActiveConfigSetter = (state: AppState) =>
  state.workspaceControlSlice.activeConfigSetter
export const WSC_DataSelector = (state: AppState) =>
  state.workspaceControlSlice.data_selector
export default workspaceControlSlice.reducer
