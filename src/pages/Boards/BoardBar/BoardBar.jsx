import { Avatar, AvatarGroup, Box, Button, Chip, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  paddingX: '5px',
  border: 'none',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
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
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2;',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
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
        <Button
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          variant='outlined'
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root ': {
              width: 34,
              height: 34,
              fontSize1: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
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
