export const toDateTimeInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)
}

export const dateTimeInputToTimestamp = (value) =>
  value ? new Date(value).getTime() : null

export const getChecklistProgress = (checklist = []) => {
  if (!checklist.length) return { completed: 0, total: 0, percentage: 0 }
  const completed = checklist.filter((item) => item.isCompleted).length

  return {
    completed,
    total: checklist.length,
    percentage: Math.round((completed / checklist.length) * 100)
  }
}

export const toggleWatcher = (watcherIds = [], userId) =>
  watcherIds.includes(userId)
    ? watcherIds.filter((id) => id !== userId)
    : [...watcherIds, userId]

export const isCardOverdue = (card, now = Date.now()) =>
  Boolean(
    card?.dueDate &&
    !card?.completedAt &&
    new Date(card.dueDate).getTime() < now
  )
