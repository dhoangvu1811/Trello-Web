import { Avatar, AvatarGroup, Box, Button, Chip, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'primary.main',
  bgcolor: 'white',
  paddingX: '5px',
  border: 'none',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box
      sx={{
        paddingX: 2,
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        borderTop: '1px solid #00bfa5'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label='DHV MERN Stack Board'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label='Public/Private WorkSpace'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label='Add To Google Drive'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label='Automation'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label='Filter'
          clickable
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Button variant='outlined' startIcon={<PersonAddIcon />}>
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            '& .MuiAvatar-root ': { width: 34, height: 34, fontSize1: 16 }
          }}
        >
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='DHVDev'>
            <Avatar alt='DHVDev' src='/static/images/avatar/1.jpg' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
