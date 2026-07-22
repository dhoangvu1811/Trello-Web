import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import HistoryIcon from '@mui/icons-material/History'
import moment from 'moment'
import { fetchBoardActivitiesAPI } from '~/apis'

const ACTION_LABELS = {
  BOARD_CREATED: 'created the board',
  BOARD_UPDATED: 'updated the board',
  BOARD_MEMBER_ROLE_CHANGED: 'changed a member role',
  COLUMN_CREATED: 'created a column',
  COLUMN_UPDATED: 'updated a column',
  COLUMN_DELETED: 'deleted a column',
  CARD_CREATED: 'created a card',
  CARD_UPDATED: 'updated a card',
  CARD_MOVED: 'moved a card',
  CARD_COMMENTED: 'commented on a card',
  CARD_MEMBER_ADDED: 'assigned a card member',
  CARD_MEMBER_REMOVED: 'removed a card member',
  INVITATION_CREATED: 'invited a board member',
  INVITATION_ACCEPTED: 'accepted a board invitation',
  INVITATION_REJECTED: 'rejected a board invitation'
}

function BoardActivityDrawer({ boardId }) {
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState([])
  const [page, setPage] = useState(0)
  const [totalActivities, setTotalActivities] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    setOpen(false)
    setActivities([])
    setPage(0)
    setTotalActivities(0)
    setLoadError(null)
  }, [boardId])

  const loadPage = async (nextPage) => {
    setLoading(true)
    setLoadError(null)
    try {
      const result = await fetchBoardActivitiesAPI(boardId, nextPage)
      setActivities((current) =>
        nextPage === 1
          ? result.activities
          : current.concat(result.activities)
      )
      setTotalActivities(result.totalActivities)
      setPage(nextPage)
    } catch (_error) {
      setLoadError('Unable to load board activity.')
    } finally {
      setLoading(false)
    }
  }

  const showActivities = async () => {
    setOpen(true)
    if (page === 0) await loadPage(1)
  }

  return (
    <>
      <Button
        onClick={showActivities}
        variant='outlined'
        startIcon={<HistoryIcon />}
        sx={{ color: 'white', borderColor: 'white' }}
      >
        Activity
      </Button>
      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 2.5 }}>
          <Typography variant='h6' fontWeight='bold'>
            Board activity
          </Typography>
          <Typography variant='body2' color='text.secondary' mb={2}>
            {totalActivities} recorded events
          </Typography>
          <Divider />

          {loadError && (
            <Typography color='error' mt={2}>
              {loadError}
            </Typography>
          )}

          {!loading && activities.length === 0 && (
            <Typography color='text.secondary' mt={3}>
              No activity recorded yet.
            </Typography>
          )}

          {activities.map((activity) => (
            <Box
              key={activity._id}
              sx={{ display: 'flex', gap: 1.5, py: 2 }}
            >
              <Avatar
                src={activity.actor?.avatar}
                alt={activity.actor?.displayName}
                sx={{ width: 36, height: 36 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant='body2'>
                  <strong>
                    {activity.actor?.displayName || 'Former member'}
                  </strong>{' '}
                  {ACTION_LABELS[activity.action] || activity.action}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {moment(activity.createdAt).format('llll')}
                </Typography>
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {!loading && activities.length < totalActivities && (
            <Button fullWidth onClick={() => loadPage(page + 1)}>
              Load more
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default BoardActivityDrawer
