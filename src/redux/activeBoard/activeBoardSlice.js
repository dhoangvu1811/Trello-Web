import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'

//Khởi tạo một giá trị State của Slice trong redux
const initialState = {
  currentActiveBoard: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middlaware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    )
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây gán nó ra một biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết
      //...

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là response.data trả về ở trên
      let board = action.payload

      //Sắp xếp các column trước khi đưa xuống các component con
      board.columns = mapOrder(board.columns, board?.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        //Xử lý kéo thả vào một column rỗng khi load lại trang web
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //Sắp xếp các cards trước khi đưa xuống các component con
          column.cards = mapOrder(column.cards, column?.cardOrderIds, '_id')
        }
      })

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
    builder.addCase(fetchBoardDetailsAPI.rejected, (state, action) => {
      state.currentActiveBoard = null
    })
  }
})

// Action là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

//Selectors: là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra dùng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
