import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNotification,
  fetchInvitationsAPI,
  selectCurrentNotification,
  updateBoardInvitationAPI
} from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/main'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

function Notifications() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectCurrentNotification)
  const [newNotifincation, setNewNotification] = useState(false)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Cập nhật trạng thái của một lời mời tham gia board
  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then((res) => {
      if (
        res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      ) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      }
    })
  }

  // fetch danh sách các lời mới invitations
  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    // Tạo func xử lý khi nhận được sự kiện real-time
    const onReceiveNewInvitation = (invitation) => {
      // Nếu thằng user đang đăng nhập hiện tại đang lưu trong redux chính là thằng invitee trong bản ghi Invitation
      if (invitation.inviteeId === currentUser._id) {
        // B1: Thêm bản ghi invitation mới vào redux
        dispatch(addNotification(invitation))
        // B2: Cập nhật trạng thái có thông báo đến
        setNewNotification(true)
      }
    }

    // Lắng nghe một sự kiện real time có tên là BE_USER_INVITED_TO_BOARD
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    // Clean up sự kiện để ngăn chặn việc bị đăng ký lặp lại event
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [dispatch, currentUser._id])

  return (
    <Box>
      <Tooltip title='Notifications'>
        <Badge
          color='warning'
          variant={newNotifincation ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id='basic-button-open-notification'
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon
            sx={{
              color: newNotifincation ? 'yellow' : 'white'
            }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id='basic-notification-drop-down'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>
            You do not have any new notifications.
          </MenuItem>
        )}
        {notifications?.map((notification, index) => (
          <Box key={index}>
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: 'auto'
              }}
            >
              <Box
                sx={{
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize='small' />
                  </Box>
                  <Box>
                    <strong>{notification.inviter?.displayName}</strong> had
                    invited you to join the board
                    <strong> {notification.board?.title}</strong>
                  </Box>
                </Box>

                {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                {notification.boardInvitation.status ===
                  BOARD_INVITATION_STATUS.PENDING && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() =>
                        updateBoardInvitation(
                          BOARD_INVITATION_STATUS.ACCEPTED,
                          notification._id
                        )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='secondary'
                      size='small'
                      onClick={() =>
                        updateBoardInvitation(
                          BOARD_INVITATION_STATUS.REJECTED,
                          notification._id
                        )
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                )}

                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'flex-end'
                  }}
                >
                  {notification.boardInvitation.status ===
                    BOARD_INVITATION_STATUS.ACCEPTED && (
                    <Chip
                      icon={<DoneIcon />}
                      label='Accepted'
                      color='success'
                      size='small'
                    />
                  )}
                  {notification.boardInvitation.status ===
                    BOARD_INVITATION_STATUS.REJECTED && (
                    <Chip
                      icon={<NotInterestedIcon />}
                      label='Rejected'
                      size='small'
                    />
                  )}
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='span' sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== notifications.length - 1 && <Divider />}
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default Notifications
