import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { CARD_PRIORITIES } from '~/utils/constants'

const toDateTimeInput = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)
}

function CardDetailsPanel({ card, currentUserId, canEdit, onUpdate }) {
  const [startDate, setStartDate] = useState(toDateTimeInput(card?.startDate))
  const [dueDate, setDueDate] = useState(toDateTimeInput(card?.dueDate))
  const [labelName, setLabelName] = useState('')
  const [labelColor, setLabelColor] = useState('#0C66E4')
  const [checklistTitle, setChecklistTitle] = useState('')
  const checklist = card?.checklist || []
  const completedItems = checklist.filter((item) => item.isCompleted).length
  const progress = checklist.length
    ? Math.round((completedItems / checklist.length) * 100)
    : 0

  const saveDates = () => onUpdate({
    startDate: startDate ? new Date(startDate).getTime() : null,
    dueDate: dueDate ? new Date(dueDate).getTime() : null
  })

  const addLabel = async () => {
    const name = labelName.trim()
    if (!name) return
    await onUpdate({
      labels: [...(card?.labels || []), { name, color: labelColor }]
    })
    setLabelName('')
  }

  const addChecklistItem = async () => {
    const title = checklistTitle.trim()
    if (!title) return
    await onUpdate({
      checklist: [...checklist, { title, isCompleted: false }]
    })
    setChecklistTitle('')
  }

  const updateChecklistItem = (itemId, changes) => onUpdate({
    checklist: checklist.map((item) =>
      item._id === itemId ? { ...item, ...changes } : item
    )
  })

  const isWatching = card?.watcherIds?.includes(currentUserId)

  return (
    <Stack spacing={3} sx={{ mb: 3 }}>
      <Box>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Priority & status</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl size='small' sx={{ minWidth: 160 }} disabled={!canEdit}>
            <InputLabel>Priority</InputLabel>
            <Select
              label='Priority'
              value={card?.priority || CARD_PRIORITIES.MEDIUM}
              onChange={(event) => onUpdate({ priority: event.target.value })}
            >
              {Object.values(CARD_PRIORITIES).map((priority) => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(card?.completedAt)}
                disabled={!canEdit}
                onChange={(event) => onUpdate({
                  completedAt: event.target.checked ? Date.now() : null
                })}
              />
            }
            label='Completed'
          />
          <Button
            variant={isWatching ? 'contained' : 'outlined'}
            disabled={!canEdit}
            onClick={() => onUpdate({
              watcherIds: isWatching
                ? card.watcherIds.filter((id) => id !== currentUserId)
                : [...(card?.watcherIds || []), currentUserId]
            })}
          >
            {isWatching ? 'Watching' : 'Watch'}
          </Button>
        </Stack>
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Dates</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField
            label='Start date'
            type='datetime-local'
            size='small'
            value={startDate}
            disabled={!canEdit}
            onChange={(event) => setStartDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Due date'
            type='datetime-local'
            size='small'
            value={dueDate}
            disabled={!canEdit}
            onChange={(event) => setDueDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          {canEdit && <Button variant='outlined' onClick={saveDates}>Save dates</Button>}
        </Stack>
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Labels</Typography>
        <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap' sx={{ mb: 1 }}>
          {(card?.labels || []).map((label) => (
            <Chip
              key={label._id}
              label={label.name}
              sx={{ bgcolor: label.color, color: '#fff' }}
              onDelete={canEdit
                ? () => onUpdate({
                  labels: card.labels.filter((item) => item._id !== label._id)
                })
                : undefined}
            />
          ))}
        </Stack>
        {canEdit && <Stack direction='row' spacing={1}>
          <TextField
            size='small'
            label='Label name'
            value={labelName}
            onChange={(event) => setLabelName(event.target.value)}
          />
          <TextField
            size='small'
            type='color'
            value={labelColor}
            onChange={(event) => setLabelColor(event.target.value)}
            sx={{ width: 64 }}
          />
          <Button
            aria-label='Add label'
            startIcon={<AddIcon />}
            onClick={addLabel}
          >Add</Button>
        </Stack>}
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600 }}>Checklist ({progress}%)</Typography>
        <LinearProgress variant='determinate' value={progress} sx={{ my: 1 }} />
        <Stack spacing={0.5}>
          {checklist.map((item) => (
            <Stack key={item._id} direction='row' alignItems='center'>
              <Checkbox
                checked={item.isCompleted}
                disabled={!canEdit}
                onChange={(event) => updateChecklistItem(item._id, {
                  isCompleted: event.target.checked
                })}
              />
              <Typography
                sx={{
                  flex: 1,
                  textDecoration: item.isCompleted ? 'line-through' : 'none'
                }}
              >
                {item.title}
              </Typography>
              {canEdit && <Button
                color='error'
                aria-label={`Delete ${item.title}`}
                onClick={() => onUpdate({
                  checklist: checklist.filter((entry) => entry._id !== item._id)
                })}
              >
                <DeleteOutlineIcon />
              </Button>}
            </Stack>
          ))}
        </Stack>
        {canEdit && <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size='small'
            label='Checklist item'
            value={checklistTitle}
            onChange={(event) => setChecklistTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addChecklistItem()
            }}
          />
          <Button aria-label='Add checklist item' onClick={addChecklistItem}>
            Add
          </Button>
        </Stack>}
      </Box>
    </Stack>
  )
}

export default CardDetailsPanel
