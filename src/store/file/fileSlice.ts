import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { v4 as uuidv4 } from "uuid"
import axios from "axios"

export interface FileState {
  id: string
  name: string
  isFolder: boolean
  children?: string[]
  content?: string
  data?: string
}

export interface FilesState {
  files: any
  fileItems: FileState[] // 'files'를 'fileItems'로 변경
  selectedFileId: string | null
  openTabs: string[] // 열려 있는 탭들의 ID 목록
}

const initialState: FilesState = {
  fileItems: [], // 'files'를 'fileItems'로 변경
  selectedFileId: null,
  openTabs: []
}

// 전체 파일 및 폴더 데이터를 패치하는 비동기 액션
export const fetchFiles = createAsyncThunk<FileState[], void, { rejectValue: string }>(
  "files/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3001/files")
      console.log("Fetched files:", response.data) // 가져온 데이터 확인
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

//파일 추가를 위한 비동기 액션
export const addFileAsync = createAsyncThunk("files/addFileAsync", async (fileName: string) => {
  const newFile = {
    id: uuidv4(),
    name: fileName,
    isFolder: false,
    content: ""
  }
  // db.json에 파일 추가
  const response = await axios.post("http://localhost:3001/files", newFile)
  console.log("New file added:", response.data) // 추가된 파일의 데이터 확인
  return response.data // 추가된 파일의 데이터 반환
})

//폴더 추가를 위한 비동기 액션
export const addFolderAsync = createAsyncThunk("files/addFolderAsync", async (folderName: string) => {
  const newFolder = {
    id: uuidv4(),
    name: folderName,
    isFolder: true,
    children: []
  }
  // db.json에 폴더 추가
  const response = await axios.post("http://localhost:3001/files", newFolder)
  console.log("New folder added:", response.data) // 추가된 폴더의 데이터 확인
  return response.data // 추가된 폴더의 데이터 반환
})

export const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<string>) => {
      const newFile: FileState = {
        id: uuidv4(), // uuid로 고유한 ID 생성
        name: action.payload,
        isFolder: false,
        content: "" // 새 파일의 기본 내용
      }
      state.fileItems.push(newFile) // 'state.files'를 'state.fileItems'로 변경
      console.log("File added:", newFile) // 추가된 파일 확인
    },
    addFolder: (state, action: PayloadAction<string>) => {
      const newFolder: FileState = {
        id: uuidv4(), // uuid로 고유한 ID 생성
        name: action.payload,
        isFolder: true,
        children: []
      }
      state.fileItems.push(newFolder) // 'state.files'를 'state.fileItems'로 변경
      console.log("Folder added:", newFolder) // 추가된 폴더 확인
    },
    selectFile: (state, action: PayloadAction<string>) => {
      state.selectedFileId = action.payload
      if (!state.openTabs.includes(action.payload)) {
        state.openTabs.push(action.payload) // 파일 선택 시 openTabs에 추가
        console.log("File selected:", action.payload) // 선택된 파일 확인
      }
    },
    closeTab: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.filter(tabId => tabId !== action.payload) // 특정 탭 닫기
      console.log("Tab closed:", action.payload) // 닫힌 탭 확인
    },
    updateFileContent: (state, action: PayloadAction<{ fileId: string; content: string }>) => {
      const { fileId, content } = action.payload
      const file = state.fileItems.find(file => file.id === fileId) // 'state.files'를 'state.fileItems'로 변경
      if (file) {
        file.content = content
        console.log("File content updated:", file) // 파일 내용 업데이트 확인
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(addFileAsync.fulfilled, (state, action) => {
        state.fileItems.push(action.payload) // 'state.files'를 'state.fileItems'로 변경
        console.log("File added:", action.payload) // 추가된 파일 확인
      })
      .addCase(addFolderAsync.fulfilled, (state, action) => {
        state.fileItems.push(action.payload) // 'state.files'를 'state.fileItems'로 변경
        console.log("Folder added:", action.payload) // 추가된 폴더 확인
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        // 패치된 데이터로 상태 업데이트
        state.fileItems = action.payload // 'state.files'를 'state.fileItems'로 변경
        console.log("Fetched files:", action.payload) // 가져온 파일 확인
      })
  }
})

export const selectFiles = (state: RootState) => state.files.fileItems // 'state.files.files'를 'state.files.fileItems'로 변경
export const selectSelectedFile = (state: RootState) =>
  state.files.fileItems.find(file => file.id === state.files.selectedFileId) // 'state.files.files'를 'state.files.fileItems'로 변경

export const { addFile, addFolder, selectFile, closeTab, updateFileContent } = fileSlice.actions

export default fileSlice.reducer
