import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //Nếu dùng pointerSensor thì phải kết hợp với thuộc tính touchAction:'none' ở những phần tử kéo thả
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }
  })
  // Yêu cầu chuột di chuyển 10px mới kích hoạt kéo thả(fix trường hợp click chuột kích hoạt kéo thả)
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  //Nhấn giữ ngón tay 250ms và dung sai của cảm ứng là 5px (di chuyển chênh lệch 5px) thì mới kích hoạt kéo thả
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 }
  })
  // const sensors = useSensors(pointerSensor)
  //Ưu tiên sử dụng kết hợp 2 loại sensor (cảm ứng) chuột và chạm
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  //Cùng một thời điểm chỉ có một phần tử đang được kéo (Column hoặc Card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại over (tránh trường hợp kéo ra ngoài thì over bị null)
    if (!over) return

    //Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy vị trí cũ từ active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
      // Lấy vị trí mới từ over
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id)

      // Dùng arrayMode để sắp xếp lại mảng column ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      /* dndOrderedColumnsIds được sử dụng sau khi gọi API để update dữ liệu lên DB
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
      console.log('dndOrderedColumns: ', dndOrderedColumns)
      console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds) */
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  // Animation khi Drop (thả) phần tử
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2;',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
