import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canEditBoardContent,
  canManageBoard,
  canManageBoardRoles
} from '../src/utils/boardPermissions.js'
import { BOARD_ROLES } from '../src/utils/boardRoles.js'

test('allows content edits only for owner, admin, and member', () => {
  assert.equal(canEditBoardContent(BOARD_ROLES.OWNER), true)
  assert.equal(canEditBoardContent(BOARD_ROLES.ADMIN), true)
  assert.equal(canEditBoardContent(BOARD_ROLES.MEMBER), true)
  assert.equal(canEditBoardContent(BOARD_ROLES.VIEWER), false)
  assert.equal(canEditBoardContent(undefined), false)
})

test('allows board management for owner and admin', () => {
  assert.equal(canManageBoard(BOARD_ROLES.OWNER), true)
  assert.equal(canManageBoard(BOARD_ROLES.ADMIN), true)
  assert.equal(canManageBoard(BOARD_ROLES.MEMBER), false)
  assert.equal(canManageBoard(BOARD_ROLES.VIEWER), false)
})

test('reserves role management for owners', () => {
  assert.equal(canManageBoardRoles(BOARD_ROLES.OWNER), true)
  assert.equal(canManageBoardRoles(BOARD_ROLES.ADMIN), false)
  assert.equal(canManageBoardRoles(BOARD_ROLES.MEMBER), false)
  assert.equal(canManageBoardRoles(BOARD_ROLES.VIEWER), false)
})
