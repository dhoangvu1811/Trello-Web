export const BOARD_UPDATED_EVENT = 'BE_BOARD_UPDATED'

export const createBoardRefreshHandler = ({
  boardId,
  refreshBoard,
  delay = 100,
  schedule = setTimeout,
  cancel = clearTimeout
}) => {
  let pendingRefresh

  const handleBoardUpdated = (event) => {
    if (event?.boardId !== boardId) return

    if (pendingRefresh !== undefined) cancel(pendingRefresh)
    pendingRefresh = schedule(() => {
      pendingRefresh = undefined
      refreshBoard()
    }, delay)
  }

  const dispose = () => {
    if (pendingRefresh !== undefined) cancel(pendingRefresh)
    pendingRefresh = undefined
  }

  return { handleBoardUpdated, dispose }
}
