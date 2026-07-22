import { BOARD_ROLES } from './boardRoles.js'

export const canEditBoardContent = (role) =>
  [BOARD_ROLES.OWNER, BOARD_ROLES.ADMIN, BOARD_ROLES.MEMBER].includes(role)

export const canManageBoard = (role) =>
  [BOARD_ROLES.OWNER, BOARD_ROLES.ADMIN].includes(role)

export const canManageBoardRoles = (role) => role === BOARD_ROLES.OWNER
