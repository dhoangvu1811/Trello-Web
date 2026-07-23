import test from 'node:test'
import assert from 'node:assert/strict'
import {
  dateTimeInputToTimestamp,
  getChecklistProgress,
  isCardOverdue,
  toDateTimeInput,
  toggleWatcher
} from '../src/utils/cardPhase1.js'

test('converts phase one date inputs in both directions', () => {
  const timestamp = dateTimeInputToTimestamp('2030-01-02T09:30')

  assert.equal(Number.isFinite(timestamp), true)
  assert.equal(toDateTimeInput(timestamp), '2030-01-02T09:30')
  assert.equal(dateTimeInputToTimestamp(''), null)
  assert.equal(toDateTimeInput('invalid'), '')
})

test('calculates checklist progress including the empty state', () => {
  assert.deepEqual(getChecklistProgress(), {
    completed: 0,
    total: 0,
    percentage: 0
  })
  assert.deepEqual(
    getChecklistProgress([
      { isCompleted: true },
      { isCompleted: false },
      { isCompleted: true }
    ]),
    { completed: 2, total: 3, percentage: 67 }
  )
})

test('toggles only the current watcher without mutating the source', () => {
  const watchers = ['user-1']

  assert.deepEqual(toggleWatcher(watchers, 'user-2'), ['user-1', 'user-2'])
  assert.deepEqual(toggleWatcher(watchers, 'user-1'), [])
  assert.deepEqual(watchers, ['user-1'])
})

test('detects overdue numeric, Date, and ISO deadlines consistently', () => {
  const now = 1_800_000_000_000
  const overdue = now - 1

  assert.equal(isCardOverdue({ dueDate: overdue }, now), true)
  assert.equal(isCardOverdue({ dueDate: new Date(overdue) }, now), true)
  assert.equal(isCardOverdue({ dueDate: new Date(overdue).toISOString() }, now), true)
  assert.equal(
    isCardOverdue({ dueDate: overdue, completedAt: now - 100 }, now),
    false
  )
  assert.equal(isCardOverdue({ dueDate: now + 1 }, now), false)
})
