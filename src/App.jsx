import { Route, Routes, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route
        path='/'
        element={
          // Ở đây replace có giá trị true để nó thay thế route /, có thể hiểu route / sẽ không còn nằm trong history của Browser
          <Navigate to={'/boards/6812c78b8fbd39624638ddbf'} replace={true} />
        }
      />
      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

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
