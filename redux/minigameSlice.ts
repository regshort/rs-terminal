import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState, AppThunk } from "./store"

// properties available on the typed object
export interface Minigame_config {
  game_state: string
  ticker2find: Array<any> | null
  tickers_found: Array<any>
  tickers_wrong: Array<any>
  tickers: Array<any> | null
  ticker_clicked: String | null
  misses: number | null
}

const initialState: Minigame_config = {
  game_state: "stopped",
  ticker2find: null,
  tickers_found: [],
  tickers_wrong: [],
  tickers: null,
  ticker_clicked: null,
  misses: null,
}

export const minigameSlice = createSlice({
  name: "minigameStore",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMisses: (state, action: PayloadAction<any>) => {
      state.misses = action.payload
    },
    setTickerClicked: (state, action: PayloadAction<any>) => {
      state.ticker_clicked = action.payload
    },
    add2TickerFound: (state, action: PayloadAction<any>) => {
      state.tickers_found.push(action.payload)
    },
    add2TickerWrong: (state, action: PayloadAction<any>) => {
      state.tickers_wrong.push(action.payload)
    },
    setTicker2Find: (state, action: PayloadAction<any>) => {
      state.ticker2find = action.payload
    },
    setGameState: (state, action: PayloadAction<any>) => {
      state.game_state = action.payload
    },
    setTickers: (state, action: PayloadAction<any>) => {
      state.tickers = action.payload
    },
  },
})

export const {
  add2TickerWrong,
  setMisses,
  setTickerClicked,
  add2TickerFound,
  setTicker2Find,
  setGameState,
  setTickers,
} = minigameSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getGameState = (state: AppState) => state.minigameSlice.game_state

export const getTickers = (state: AppState) => state.minigameSlice.tickers
export const getTickers2Find = (state: AppState) =>
  state.minigameSlice.ticker2find
export const getTickersClicked = (state: AppState) =>
  state.minigameSlice.ticker_clicked
export const getTickersMisses = (state: AppState) => state.minigameSlice.misses
export const getTickersFound = (state: AppState) =>
  state.minigameSlice.tickers_found
export const getTickersWrong = (state: AppState) =>
  state.minigameSlice.tickers_wrong

export default minigameSlice.reducer
