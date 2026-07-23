export const CARD_NOTIFICATIONS_UPDATED_EVENT =
  'BE_CARD_NOTIFICATIONS_UPDATED'

export const createNotificationRefreshHandler = ({
  refreshNotifications,
  schedule = setTimeout,
  cancel = clearTimeout,
  delay = 100
}) => {
  let pendingTimer

  const handleNotificationsUpdated = () => {
    if (pendingTimer) cancel(pendingTimer)
    pendingTimer = schedule(() => {
      pendingTimer = undefined
      refreshNotifications()
    }, delay)
  }

  const dispose = () => {
    if (pendingTimer) cancel(pendingTimer)
    pendingTimer = undefined
  }

  return { handleNotificationsUpdated, dispose }
}

export const startNotificationPolling = ({
  refreshNotifications,
  schedule = setInterval,
  cancel = clearInterval,
  interval = 60_000
}) => {
  const intervalId = schedule(refreshNotifications, interval)
  return () => cancel(intervalId)
}
