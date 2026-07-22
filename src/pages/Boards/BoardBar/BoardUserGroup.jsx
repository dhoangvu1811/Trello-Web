import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { useDispatch } from 'react-redux'
import { updateBoardMemberRoleAPI } from '~/apis'
import { updateBoardMemberRole } from '~/redux/activeBoard/activeBoardSlice'
import { BOARD_ROLES } from '~/utils/constants'
import { canManageBoardRoles } from '~/utils/boardPermissions'

const ASSIGNABLE_ROLES = [
  BOARD_ROLES.ADMIN,
  BOARD_ROLES.MEMBER,
  BOARD_ROLES.VIEWER
]

function BoardUserGroup({
  boardUsers = [],
  boardId,
  currentUserRole,
  limit = 5
}) {
  const dispatch = useDispatch()
  const [anchorElement, setAnchorElement] = useState(null)
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const canManageRoles = canManageBoardRoles(currentUserRole)
  const isOpen = Boolean(anchorElement)

  const updateRole = async (userId, role) => {
    setUpdatingUserId(userId)
    try {
      const updatedRole = await updateBoardMemberRoleAPI(boardId, userId, role)
      dispatch(updateBoardMemberRole(updatedRole))
    } catch (_error) {
      // The shared Axios interceptor presents the API error to the user.
    } finally {
      setUpdatingUserId(null)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {boardUsers.slice(0, limit).map((user) => (
        <Tooltip
          title={`${user.displayName} · ${user.boardRole}`}
          key={user._id}
        >
          <Avatar
            sx={{ width: 34, height: 34 }}
            alt={user.displayName}
            src={user.avatar}
          />
        </Tooltip>
      ))}

      {boardUsers.length > limit && (
        <Tooltip title='Show all members'>
          <Box
            onClick={(event) => setAnchorElement(event.currentTarget)}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              color: 'white',
              bgcolor: '#a4b0be'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      )}

      {canManageRoles && (
        <Tooltip title='Manage board roles'>
          <Box
            onClick={(event) => setAnchorElement(event.currentTarget)}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              color: 'white',
              bgcolor: '#ffffff29'
            }}
          >
            <ManageAccountsIcon fontSize='small' />
          </Box>
        </Tooltip>
      )}

      <Popover
        open={isOpen}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 360, p: 2 }}>
          <Typography fontWeight='bold' mb={1.5}>
            Board members
          </Typography>
          {boardUsers.map((user) => (
            <Box
              key={user._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1
              }}
            >
              <Avatar
                sx={{ width: 34, height: 34 }}
                alt={user.displayName}
                src={user.avatar}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap fontWeight='600'>
                  {user.displayName}
                </Typography>
                <Typography noWrap variant='caption' color='text.secondary'>
                  {user.email}
                </Typography>
              </Box>
              {user.boardRole === BOARD_ROLES.OWNER ? (
                <Typography variant='body2'>{BOARD_ROLES.OWNER}</Typography>
              ) : (
                <Select
                  size='small'
                  value={user.boardRole || BOARD_ROLES.MEMBER}
                  disabled={!canManageRoles || updatingUserId === user._id}
                  onChange={(event) => updateRole(user._id, event.target.value)}
                  inputProps={{ 'aria-label': `Role for ${user.displayName}` }}
                >
                  {ASSIGNABLE_ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
