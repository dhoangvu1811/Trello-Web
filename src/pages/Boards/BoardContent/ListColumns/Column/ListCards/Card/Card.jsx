import {
  Button,
  Box,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Tooltip,
  Typography
} from '@mui/material'
import { isCardOverdue } from '~/utils/cardPhase1'
import { Card as MuiCard } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import {
  showModalActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'

function Card({ card, canEdit }) {
  const dispatch = useDispatch()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card },
    disabled: !canEdit
  })
  const dndKitCardStyles = {
    // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '2px solid #2ecc71' : undefined

    // touchAction: 'none'
  }

  const shouldShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length ||
      !!card?.dueDate ||
      !!card?.checklist?.length
    )
  }

  const completedChecklistItems = card?.checklist?.filter(
    (item) => item.isCompleted
  ).length || 0
  const checklistProgress = card?.checklist?.length
    ? (completedChecklistItems / card.checklist.length) * 100
    : 0
  const isOverdue = isCardOverdue(card)
  const priorityColors = {
    LOW: 'success',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'error'
  }

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      data-testid={`card-${card._id}`}
      onClick={setActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        {!!card?.labels?.length && <Box
          sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}
        >
          {card.labels.map((label) => (
            <Chip
              key={label._id}
              size='small'
              label={label.name}
              sx={{ bgcolor: label.color, color: '#fff' }}
            />
          ))}
        </Box>}
        {card?.priority && <Chip
          size='small'
          color={priorityColors[card.priority] || 'default'}
          label={card.priority}
          sx={{ mb: 1 }}
        />}
        <Typography>{card?.title}</Typography>
        {!!card?.checklist?.length && <LinearProgress
          variant='determinate'
          value={checklistProgress}
          color={checklistProgress === 100 ? 'success' : 'primary'}
          sx={{ mt: 1 }}
        />}
      </CardContent>
      {shouldShowCardActions() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && (
            <Button size='small' startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}

          {!!card?.comments?.length && (
            <Tooltip title={'comment'}>
              <Button size='small' startIcon={<CommentIcon />}>
                {card?.comments?.length}
              </Button>
            </Tooltip>
          )}

          {!!card?.attachments?.length && (
            <Button size='small' startIcon={<AttachmentIcon />}>
              {card?.attachments?.length}
            </Button>
          )}
          {!!card?.checklist?.length && (
            <Button size='small' startIcon={<ChecklistIcon />}>
              {completedChecklistItems}/{card.checklist.length}
            </Button>
          )}
          {!!card?.dueDate && (
            <Button
              size='small'
              color={isOverdue ? 'error' : card.completedAt ? 'success' : 'inherit'}
              startIcon={<AccessTimeIcon />}
            >
              {new Date(card.dueDate).toLocaleDateString()}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
