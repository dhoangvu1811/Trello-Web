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
import { formatActivityMessage } from '~/utils/activityMessages'

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
                  {formatActivityMessage(activity)}
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
