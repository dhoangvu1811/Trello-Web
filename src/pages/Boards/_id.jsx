import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

function Board() {
  const dispatch = useDispatch()
  //Không dùng state của component mà chuyển sang dùng state của redux
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    // Call Api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  /* Gọi Api và xử lý kéo thả column
  Cập nhật mảng columnOrderIds của board chứa column (thay đổi vị trí) */
  const moveColumn = (dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    /* Trường hợp dùng speard operator này thì lại không sao bởi vì chúng ta không dùng push như ở trên
    mà là gán lại toàn bộ giá trị columns và columnOrderIds bằng hai mảng mới. Tương tự như cách làm
    array.concat */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    //Gọi Api update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
  }

  /* Gọi Api và xử lý kéo thả cards trong cùng 1 column
  Cập nhật mảng cardsOrderIds của column chứa card (thay đổi vị trí)  */
  const moveCardsInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    //Update cho chuẩn dữ liệu state board
    /* Cannot assign to read only property 'cards' of object
    Trường hợp Immutability ở đây đã đụng tới giá trị cards được coi là read only
    (nested object - can thiệp sâu dữ liệu) */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    //Gọi Api update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /* Các bước khi di chuyển card sang column khác
  B1: Cập nhật lại mảng cardOrderIds trong column cũ (xoá đi id của card đã kéo)
  B2: Cập nhật lại mảng  cardOrderIds trong column mới (thêm id của card đã kéo)
  B3: Cập nhật lại trường columnId của card đã kéo*/
  const moveCardToDifferentColumn = (
    curentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    //Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    // Tương tụ đoạn xử lý chỗ hàm moveColumn nên không ảnh hưởng Redux Toolkit Immutability
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds
    //Xử lý vấn đề khi kéo card cuối cùng ra khỏi column,column rỗng sẽ có placeholder-card
    if (prevCardOderIds[0].includes('placeholder-card')) {
      prevCardOderIds = []
    }

    // Gọi api
    moveCardToDifferentColumnAPI({
      curentCardId,
      prevColumnId,
      prevCardOderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption='Loading Board..' />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở dựa theo điều kiện có tồn tại data activeCard lưu trong Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Modal Card đang Active */}
      <ActiveCard />

      {/* Các thành phần còn lại của Board Details */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // 3 trường hợp move dưới đây thì giữ nguyên để code ở boardContent không quá dài mất kiểm soát khic đọc code
        moveColumn={moveColumn}
        moveCardsInTheSameColumn={moveCardsInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
