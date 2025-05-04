import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const baordId = '6812c78b8fbd39624638ddbf'
    // Call Api
    fetchBoardDetailsAPI(baordId).then((board) => {
      //Xử lý kéo thả vào một column rỗng khi load lại trang web
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  // Gọi API tạo mới column và làm mới lại dữ liệu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    //Khi tạo column mới thì chưa có card, cần xử lý kéo thả vào một column rỗng
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    //Cập nhật lại state board
    //Phía FE phải tự làm đúng lại state data baord thay vì phải gọi lại fetchBoardDetailsAPI
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  // Gọi API tạo mới card và làm mới lại dữ liệu state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //Cập nhật lại state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
