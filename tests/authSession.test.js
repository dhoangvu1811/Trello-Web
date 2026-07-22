import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateRefreshDelay,
  withCrossTabRefreshLock
} from '../src/utils/authSession.js'

test('refreshes one minute before access-token expiry', () => {
  assert.equal(calculateRefreshDelay(1_000_000, 100_000), 840_000)
})

test('refreshes immediately when the refresh window has started', () => {
  assert.equal(calculateRefreshDelay(120_000, 100_000), 0)
})

test('runs refresh without a browser lock when unavailable', async () => {
  assert.equal(await withCrossTabRefreshLock(async () => 'refreshed'), 'refreshed')
})
