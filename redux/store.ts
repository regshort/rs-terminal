import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import companySlice from "./companySlice"
import workspaceFormSlice from "./workspaceFormSlice"

import noteSlice from "./noteSlice"
import userSlice from "./userSlice"
import themeSlice from "./themeSlice"
import overlaySlice from "./overlaySlice"
import workspaceControlSlice from "./workspaceControlSlice"
import menuSlice from "./menuSlice"
import warningsSlice from "./warningsSlice"
import minigameSlice from "./minigameSlice"
import watchlistFromSlice from "./watchlistFromSlice"
import settingsSlice from "./settingsSlice"

export function makeStore() {
  return configureStore({
    reducer: {
      settingsSlice: settingsSlice,
      workspaceControlSlice: workspaceControlSlice,
      workspaceFormSlice: workspaceFormSlice,
      noteSlice: noteSlice,
      userSlice: userSlice,
      companySlice: companySlice,
      themeSlice: themeSlice,
      overlaySlice: overlaySlice,
      menuSlice: menuSlice,
      warningsSlice: warningsSlice,
      minigameSlice: minigameSlice,
      watchlistFromSlice: watchlistFromSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ["menuStore/setDateRange"],
          // Ignore these paths in the state
          ignoredPaths: ["menuSlice.dateRange"],
        },
      }),
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
