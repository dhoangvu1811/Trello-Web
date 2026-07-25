import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatActivityMessage,
  SUPPORTED_ACTIVITY_ACTIONS
} from '../src/utils/activityMessages.js'

test('formats every supported activity without exposing internal enum names', () => {
  for (const action of SUPPORTED_ACTIVITY_ACTIONS) {
    const message = formatActivityMessage({
      action,
      entityTitle: 'Release card',
      targetUser: { displayName: 'Alex' },
      metadata: {
        fields: ['priority', 'dueDate'],
        role: 'ADMIN',
        name: 'release-notes.pdf',
        emoji: '👍',
        reactionAction: 'ADDED'
      }
    })

    assert.equal(message.includes(action), false, action)
    assert.equal(message.includes('_'), false, action)
    assert.equal(message.length > 8, true, action)
  }
})

test('describes comment reactions with the emoji and card title', () => {
  assert.equal(
    formatActivityMessage({
      action: 'CARD_COMMENT_REACTED',
      entityTitle: 'Release card',
      metadata: { emoji: '👍', reactionAction: 'ADDED' }
    }),
    'added 👍 reaction on a comment in card “Release card”'
  )
  assert.equal(
    formatActivityMessage({
      action: 'CARD_COMMENT_REACTED',
      entityTitle: 'Release card',
      metadata: { emoji: '👍', reactionAction: 'REMOVED' }
    }),
    'removed 👍 reaction on a comment in card “Release card”'
  )
  assert.equal(
    formatActivityMessage({
      action: 'CARD_COMMENT_REACTED',
      entityTitle: 'Release card',
      metadata: {}
    }),
    'reacted to a comment in card “Release card”'
  )
})

test('uses activity metadata when a deleted entity no longer exists', () => {
  assert.equal(
    formatActivityMessage({
      action: 'COLUMN_DELETED',
      metadata: { entityTitle: 'Deprecated work' }
    }),
    'deleted column “Deprecated work”'
  )
})

test('identifies the destination column when a card is moved', () => {
  assert.equal(
    formatActivityMessage({
      action: 'CARD_MOVED',
      entityTitle: 'Release card',
      metadata: { toColumnTitle: 'Ready for QA' }
    }),
    'moved card “Release card” to column “Ready for QA”'
  )
})

test('never exposes an unknown backend action', () => {
  assert.equal(
    formatActivityMessage({ action: 'UNRECOGNIZED_INTERNAL_ACTION' }),
    'performed a board activity'
  )
})
