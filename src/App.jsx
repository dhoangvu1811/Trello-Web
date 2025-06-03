import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'

/**
 * Giải pháp Clean code trong việc xác định các rout nào cần login mới cho truy cập
 *  sử dụng <Outlet /> của react-route-dom để hiển thị các Child route
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

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

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
