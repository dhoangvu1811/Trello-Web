import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCurrentSession,
  fetchSessionAPI,
  logoutUserAPI,
  refreshSessionAPI,
  selectAccessTokenExpiresAt,
  selectAuthInitialized,
  selectCurrentUser,
  selectSessionExpiresAt
} from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'
import { socketIoInstance } from '~/socketClient'
import PasswordRecovery from '~/pages/Auth/PasswordRecovery'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import {
  calculateRefreshDelay,
  subscribeToLogout
} from '~/utils/authSession'

/**
 * Giải pháp Clean code trong việc xác định các rout nào cần login mới cho truy cập
 *  sử dụng <Outlet /> của react-route-dom để hiển thị các Child route
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const authInitialized = useSelector(selectAuthInitialized)
  const accessTokenExpiresAt = useSelector(selectAccessTokenExpiresAt)
  const sessionExpiresAt = useSelector(selectSessionExpiresAt)

  useEffect(() => {
    dispatch(fetchSessionAPI())
    return subscribeToLogout(() => dispatch(clearCurrentSession()))
  }, [dispatch])

  useEffect(() => {
    if (currentUser) {
      socketIoInstance.connect()
    } else {
      socketIoInstance.disconnect()
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser || !sessionExpiresAt) return
    const remainingSessionMs = sessionExpiresAt - Date.now()
    if (remainingSessionMs <= 0) {
      dispatch(logoutUserAPI(false))
      return
    }
    const timer = setTimeout(
      () => dispatch(logoutUserAPI(false)),
      remainingSessionMs
    )
    return () => clearTimeout(timer)
  }, [currentUser, dispatch, sessionExpiresAt])

  useEffect(() => {
    if (!currentUser || !accessTokenExpiresAt) return
    const timer = setTimeout(
      () => dispatch(refreshSessionAPI()),
      calculateRefreshDelay(accessTokenExpiresAt)
    )
    return () => clearTimeout(timer)
  }, [accessTokenExpiresAt, currentUser, dispatch])

  if (!authInitialized) {
    return <PageLoadingSpinner caption='Restoring session...' />
  }

  return (
    <Routes>
      {/* Redirect Route */}
      <Route
        path='/'
        element={
          // Ở đây replace có giá trị true để nó thay thế route /, có thể hiểu route / sẽ không còn nằm trong history của Browser
          <Navigate to={'/boards'} replace={true} />
        }
      />
      {/* ProtectedRoute là những route chỉ cho truy cập sau khi login */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* <Outlet /> của react-route-dom sẽ chạy vào các Child route*/}
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* User Setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />
      <Route path='/account/forgot-password' element={<PasswordRecovery />} />
      <Route path='/account/reset-password' element={<PasswordRecovery />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
