import { configureStore } from "@reduxjs/toolkit"
import fileReducer from "../store/file/fileSlice"

export const store = configureStore({
  reducer: {
    files: fileReducer
  }
})

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>

// AppDispatch 타입 정의
export type AppDispatch = typeof store.dispatch
