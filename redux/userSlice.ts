import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface User_config {
  defaultWorkspaceId: string
}

const initialState: User_config = {
  defaultWorkspaceId: "",
}

export const userSlice = createSlice({
  name: "userStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    set_dw: (state, action: PayloadAction<any>) => {
      state.defaultWorkspaceId = action.payload
    },
  },
})

export const { set_dw } = userSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const defaultWorkspaceId = (state: AppState) =>
  state.userSlice.defaultWorkspaceId

export default userSlice.reducer
