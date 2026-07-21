import test from 'node:test'
import assert from 'node:assert/strict'
import { createBoardRefreshHandler } from '../src/realtime/boardRealtime.js'

test('refreshes only the active board and coalesces rapid updates', () => {
  const scheduled = new Map()
  const cancelled = []
  let nextTimerId = 0
  let refreshCount = 0
  const schedule = (callback) => {
    nextTimerId += 1
    scheduled.set(nextTimerId, callback)
    return nextTimerId
  }
  const cancel = (timerId) => {
    cancelled.push(timerId)
    scheduled.delete(timerId)
  }
  const { handleBoardUpdated } = createBoardRefreshHandler({
    boardId: 'active-board',
    refreshBoard: () => {
      refreshCount += 1
    },
    schedule,
    cancel
  })

  handleBoardUpdated({ boardId: 'another-board' })
  handleBoardUpdated({ boardId: 'active-board' })
  handleBoardUpdated({ boardId: 'active-board' })

  assert.deepEqual(cancelled, [1])
  assert.equal(scheduled.size, 1)
  scheduled.get(2)()
  assert.equal(refreshCount, 1)
})

test('cancels a pending refresh when the board is closed', () => {
  const cancelled = []
  const { handleBoardUpdated, dispose } = createBoardRefreshHandler({
    boardId: 'active-board',
    refreshBoard: () => {},
    schedule: () => 7,
    cancel: (timerId) => cancelled.push(timerId)
  })

  handleBoardUpdated({ boardId: 'active-board' })
  dispose()

  assert.deepEqual(cancelled, [7])
})
