import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance, {
  refreshAccessToken
} from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { notifyOtherTabsOfLogout } from '~/utils/authSession'

//Khởi tạo một giá trị State của Slice trong redux
const initialState = {
  currentUser: null,
  accessTokenExpiresAt: null,
  sessionExpiresAt: null,
  initialized: false,
  sessionRequestId: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middlaware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    try {
      const response = await authorizedAxiosInstance.delete(
        `${API_ROOT}/v1/users/logout`
      )
      if (showSuccessMessage) toast.success('Logged out successfully!')
      return response.data
    } finally {
      notifyOtherTabsOfLogout()
    }
  }
)

export const fetchSessionAPI = createAsyncThunk(
  'user/fetchSessionAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/users/session`,
      { skipAuthErrorToast: true, skipSessionClear: true }
    )
    return response.data
  }
)

export const refreshSessionAPI = createAsyncThunk(
  'user/refreshSessionAPI',
  async () => await refreshAccessToken()
)

export const updateUserAPI = createAsyncThunk(
  'usser/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data
    )
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentSession: (state) => {
      state.currentUser = null
      state.accessTokenExpiresAt = null
      state.sessionExpiresAt = null
      state.initialized = true
      state.sessionRequestId = null
    },
    updateTokenMetadata: (state, action) => {
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt
      state.sessionExpiresAt = action.payload.sessionExpiresAt
    }
  },
  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là response.data trả về ở trên
      state.currentUser = action.payload.user
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt
      state.sessionExpiresAt = action.payload.sessionExpiresAt
      state.initialized = true
      // A session lookup started before login must not overwrite this newer session.
      state.sessionRequestId = null
    })
    builder.addCase(logoutUserAPI.pending, (state) => {
      state.currentUser = null
      state.accessTokenExpiresAt = null
      state.sessionExpiresAt = null
      state.initialized = true
      state.sessionRequestId = null
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * APi logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       */
      state.currentUser = null
      state.accessTokenExpiresAt = null
      state.sessionExpiresAt = null
      state.initialized = true
    })
    builder.addCase(logoutUserAPI.rejected, (state) => {
      state.currentUser = null
      state.accessTokenExpiresAt = null
      state.sessionExpiresAt = null
      state.initialized = true
    })
    builder.addCase(fetchSessionAPI.pending, (state, action) => {
      state.initialized = false
      state.sessionRequestId = action.meta.requestId
    })
    builder.addCase(fetchSessionAPI.fulfilled, (state, action) => {
      if (state.sessionRequestId !== action.meta.requestId) return
      state.currentUser = action.payload.user
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt
      state.sessionExpiresAt = action.payload.sessionExpiresAt
      state.initialized = true
      state.sessionRequestId = null
    })
    builder.addCase(fetchSessionAPI.rejected, (state, action) => {
      if (state.sessionRequestId !== action.meta.requestId) return
      state.currentUser = null
      state.accessTokenExpiresAt = null
      state.sessionExpiresAt = null
      state.initialized = true
      state.sessionRequestId = null
    })
    builder.addCase(refreshSessionAPI.rejected, (state) => {
      state.currentUser = null
      state.accessTokenExpiresAt = null
      state.sessionExpiresAt = null
      state.initialized = true
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// export const {} = userSlice.actions

//Selectors: là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra dùng
export const { clearCurrentSession, updateTokenMetadata } = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
export const selectAuthInitialized = (state) => state.user.initialized
export const selectAccessTokenExpiresAt = (state) =>
  state.user.accessTokenExpiresAt
export const selectSessionExpiresAt = (state) => state.user.sessionExpiresAt

// export default userSlice.reducer
export const userReducer = userSlice.reducer
