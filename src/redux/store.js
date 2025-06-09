import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationReducer } from './notifications/notificationsSlice'

//Cấu hình redux-persist
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' //default là localstorage

// Cấu hình Persist
const rootPersistConfig = {
  key: 'root', // key của persist do chúng ta chỉ định cứ để mặc định là root
  storage: storage, // Lưu vào localstorage
  whiteList: ['user'] // định nghĩa các slice ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
  // blackList: ['user'] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

//Combine các reducers trong dự án của chúng ta
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationReducer
})

//Thực hiện persist Reducer
const persistReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})
