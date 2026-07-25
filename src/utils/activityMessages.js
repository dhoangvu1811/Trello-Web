const FIELD_LABELS = {
  title: 'title',
  description: 'description',
  priority: 'priority',
  startDate: 'start date',
  dueDate: 'due date',
  completedAt: 'completion status',
  labels: 'labels',
  checklist: 'checklist',
  watcherIds: 'watchers',
  cover: 'cover',
  columnOrderIds: 'column order',
  cardOrderIds: 'card order'
}

const quote = (value) => value ? `“${value}”` : ''

const getEntityTitle = (activity) =>
  activity.metadata?.entityTitle || activity.entityTitle

const getTargetName = (activity) =>
  activity.targetUser?.displayName ||
  activity.targetUser?.userName ||
  'a board member'

const describeFields = (fields = []) => {
  const labels = fields.map((field) => FIELD_LABELS[field] || field)
  if (!labels.length) return 'card details'
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
}

const cardName = (activity) =>
  getEntityTitle(activity)
    ? `card ${quote(getEntityTitle(activity))}`
    : 'a card'

const columnName = (activity) =>
  getEntityTitle(activity)
    ? `column ${quote(getEntityTitle(activity))}`
    : 'a column'

const boardName = (activity) =>
  getEntityTitle(activity)
    ? `board ${quote(getEntityTitle(activity))}`
    : 'the board'

const attachmentName = (activity) =>
  activity.metadata?.name
    ? `attachment ${quote(activity.metadata.name)}`
    : 'an attachment'

const FORMATTERS = {
  BOARD_CREATED: (activity) => `created ${boardName(activity)}`,
  BOARD_UPDATED: (activity) => activity.metadata?.fields?.includes('columnOrderIds')
    ? `reordered columns on ${boardName(activity)}`
    : `updated ${boardName(activity)}`,
  BOARD_MEMBER_ROLE_CHANGED: (activity) =>
    `changed ${getTargetName(activity)}'s role to ${activity.metadata?.role || 'a new role'}`,
  COLUMN_CREATED: (activity) => `created ${columnName(activity)}`,
  COLUMN_UPDATED: (activity) => activity.metadata?.fields?.includes('cardOrderIds')
    ? `reordered cards in ${columnName(activity)}`
    : `updated ${columnName(activity)}`,
  COLUMN_DELETED: (activity) => `deleted ${columnName(activity)}`,
  CARD_CREATED: (activity) => `created ${cardName(activity)}`,
  CARD_UPDATED: (activity) =>
    `updated ${describeFields(activity.metadata?.fields)} on ${cardName(activity)}`,
  CARD_MOVED: (activity) => {
    const destination = activity.metadata?.toColumnTitle
      ? `column ${quote(activity.metadata.toColumnTitle)}`
      : 'another column'
    return `moved ${cardName(activity)} to ${destination}`
  },
  CARD_COMMENTED: (activity) => `commented on ${cardName(activity)}`,
  CARD_COMMENT_EDITED: (activity) => `edited a comment on ${cardName(activity)}`,
  CARD_COMMENT_DELETED: (activity) => `deleted a comment from ${cardName(activity)}`,
  CARD_COMMENT_REACTED: (activity) => {
    if (!activity.metadata?.reactionAction) {
      return `reacted to a comment in ${cardName(activity)}`
    }
    const reaction = activity.metadata?.emoji
      ? ` ${activity.metadata.emoji}`
      : ''
    const verb = activity.metadata?.reactionAction === 'REMOVED'
      ? 'removed'
      : 'added'
    return `${verb}${reaction} reaction on a comment in ${cardName(activity)}`
  },
  CARD_MEMBER_ADDED: (activity) =>
    `assigned ${getTargetName(activity)} to ${cardName(activity)}`,
  CARD_MEMBER_REMOVED: (activity) =>
    `removed ${getTargetName(activity)} from ${cardName(activity)}`,
  CARD_DUE_DATE_CHANGED: (activity) =>
    `changed the due date of ${cardName(activity)}`,
  CARD_CHECKLIST_COMPLETED: (activity) =>
    `completed the checklist on ${cardName(activity)}`,
  CARD_COMPLETED: (activity) => `marked ${cardName(activity)} as completed`,
  CARD_ARCHIVED: (activity) => `archived ${cardName(activity)}`,
  CARD_RESTORED: (activity) => `restored ${cardName(activity)}`,
  CARD_COPIED: (activity) => `copied ${cardName(activity)}`,
  CARD_ATTACHMENT_ADDED: (activity) =>
    `added ${attachmentName(activity)} to ${cardName(activity)}`,
  CARD_ATTACHMENT_REMOVED: (activity) =>
    `removed ${attachmentName(activity)} from ${cardName(activity)}`,
  INVITATION_CREATED: (activity) =>
    `invited ${getTargetName(activity)} to the board`,
  INVITATION_ACCEPTED: () => 'accepted a board invitation',
  INVITATION_REJECTED: () => 'rejected a board invitation'
}

export const SUPPORTED_ACTIVITY_ACTIONS = Object.freeze(
  Object.keys(FORMATTERS)
)

export const formatActivityMessage = (activity) => {
  const formatter = FORMATTERS[activity.action]
  return formatter ? formatter(activity) : 'performed a board activity'
}
