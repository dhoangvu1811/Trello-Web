import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { toast } from 'react-toastify'

/* Boards */
// Đã move vào redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  return response.data
}

/* Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  )
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  )
  return response.data
}

/* Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  )
  return response.data
}

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )
  toast.success(
    'Account created successfully! Please check and verify your account before logging in! ',
    { theme: 'colored' }
  )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  )
  toast.success(
    'Account verified successfully! Now you can login to enjoy our services! Have a good day!',
    { theme: 'colored' }
  )
  return response.data
}

export const updateBoardMemberRoleAPI = async (
  boardId,
  userId,
  role
) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}/members/${userId}/role`,
    { role }
  )
  return response.data
}

export const fetchBoardActivitiesAPI = async (
  boardId,
  page,
  itemsPerPage = 20
) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/boards/${boardId}/activities`,
    { params: { page, itemsPerPage } }
  )
  return response.data
}

export const forgotPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/forgot-password`,
    data
  )
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/reset-password`,
    data
  )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/refresh_token`,
    undefined,
    { skipAuthErrorToast: true }
  )
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  )
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/boards`,
    data
  )
  toast.success('Board created successfully')
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  )

  return response.data
}

export const setCardArchivedAPI = async (cardId, archived) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}/archive`,
    { archived }
  )
  return response.data
}

export const copyCardAPI = async (cardId, targetColumnId) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards/${cardId}/copy`,
    { targetColumnId }
  )
  return response.data
}

export const moveCardAPI = async (cardId, targetColumnId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}/move`,
    { targetColumnId }
  )
  return response.data
}

export const uploadCardAttachmentAPI = async (cardId, file) => {
  const data = new FormData()
  data.append('attachment', file)
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards/${cardId}/attachments`,
    data
  )
  return response.data
}

export const deleteCardAttachmentAPI = async (cardId, attachmentId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/cards/${cardId}/attachments/${attachmentId}`
  )
  return response.data
}

export const fetchArchivedCardsAPI = async (boardId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/cards/archived/board/${boardId}`
  )
  return response.data
}

export const fetchCardNotificationsAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/notifications`
  )
  return response.data
}

export const markCardNotificationReadAPI = async (notificationId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/notifications/${notificationId}/read`
  )
  return response.data
}

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/invitations/board`,
    data
  )
  toast.success('User invited to board successfully!')

  return response.data
}
