import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface Theme_config {
  theme: string
  perTheme: string
}

const initialState: Theme_config = {
  theme: "",
  perTheme: "",
}

export const themeSlice = createSlice({
  name: "themeStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setGlobalTheme: (state, action: PayloadAction<any>) => {
      state.theme = action.payload
      state.perTheme =
        action.payload === "dark" ? "Material Dark" : "Material Light"
    },
  },
})

export const { setGlobalTheme } = themeSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getGlobalTheme = (state: AppState) => state.themeSlice

export default themeSlice.reducer
