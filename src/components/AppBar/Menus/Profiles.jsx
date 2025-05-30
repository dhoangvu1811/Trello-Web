import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import React from 'react'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Log out of your account?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        dispatch(logoutUserAPI())
      })
      .catch(() => {})
  }

  return (
    <Box>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={currentUser?.displayname}
            src={currentUser?.avatar}
          >
            M
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id='basic-menu-profiles'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <MenuItem
          sx={{
            '&:hover': { color: 'success.light' }
          }}
        >
          <Avatar
            sx={{ width: '28px', height: '28px', mr: 2 }}
            alt={currentUser?.displayname}
            src={currentUser?.avatar}
          />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: 'warning.dark',
              '& .logout-icon': { color: 'warning.dark' }
            }
          }}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <Logout className='logout-icon' fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
