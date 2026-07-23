import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CARD_NOTIFICATIONS_UPDATED_EVENT,
  createNotificationRefreshHandler,
  startNotificationPolling
} from '../src/realtime/cardNotificationsRealtime.js'

test('uses the backend card notification event name', () => {
  assert.equal(
    CARD_NOTIFICATIONS_UPDATED_EVENT,
    'BE_CARD_NOTIFICATIONS_UPDATED'
  )
})

test('coalesces rapid notification refreshes and supports cleanup', () => {
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
  const {
    handleNotificationsUpdated,
    dispose
  } = createNotificationRefreshHandler({
    refreshNotifications: () => {
      refreshCount += 1
    },
    schedule,
    cancel
  })

  handleNotificationsUpdated()
  handleNotificationsUpdated()
  assert.deepEqual(cancelled, [1])
  const scheduledRefresh = scheduled.get(2)
  scheduled.delete(2)
  scheduledRefresh()
  assert.equal(refreshCount, 1)

  handleNotificationsUpdated()
  dispose()
  assert.deepEqual(cancelled, [1, 3])
  assert.equal(scheduled.size, 0)
})

test('polls due notifications and clears the interval on cleanup', () => {
  let scheduledCallback
  let scheduledInterval
  let cancelledInterval
  let refreshCount = 0
  const stop = startNotificationPolling({
    refreshNotifications: () => {
      refreshCount += 1
    },
    schedule: (callback, interval) => {
      scheduledCallback = callback
      scheduledInterval = interval
      return 42
    },
    cancel: (intervalId) => {
      cancelledInterval = intervalId
    }
  })

  assert.equal(scheduledInterval, 60_000)
  scheduledCallback()
  assert.equal(refreshCount, 1)
  stop()
  assert.equal(cancelledInterval, 42)
})
