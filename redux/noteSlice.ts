import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface Note_configs {
  note: string
  global: any
  loading: boolean
  updatedAt: any
}

const initialState: Note_configs = {
  note: "",
  global: {},
  loading: true,
  updatedAt: "",
}

export const noteSlice = createSlice({
  name: "noteStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    set: (state, action: PayloadAction<any>) => {
      state.note = action.payload
    },
    setUpdatedAt: (state, action: PayloadAction<any>) => {
      state.updatedAt = action.payload
    },
    setGlobal: (state, action: PayloadAction<any>) => {
      state.global = action.payload
    },
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload
    },
  },
})

export const { setUpdatedAt, set, setGlobal, setLoading } = noteSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const noteLoading = (state: AppState) => state.noteSlice.loading
export const noteMine = (state: AppState) => state.noteSlice.note
export const noteGlobal = (state: AppState) => state.noteSlice.global
export const noteUpdatedAt = (state: AppState) => state.noteSlice.updatedAt

export default noteSlice.reducer
