const LOGOUT_EVENT_KEY = 'trello:auth:logout'

export const notifyOtherTabsOfLogout = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString())
}

export const subscribeToLogout = (onLogout) => {
  if (typeof window === 'undefined') return () => {}
  const handleStorage = (event) => {
    if (event.key === LOGOUT_EVENT_KEY) onLogout()
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}

export const calculateRefreshDelay = (
  accessTokenExpiresAt,
  now = Date.now(),
  refreshBeforeMs = 60_000
) => Math.max(0, accessTokenExpiresAt - now - refreshBeforeMs)

export const withCrossTabRefreshLock = async (refresh) => {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return await navigator.locks.request('trello:auth:refresh', refresh)
  }
  return await refresh()
}
