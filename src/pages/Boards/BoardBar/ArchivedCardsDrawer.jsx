import { useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { fetchArchivedCardsAPI, setCardArchivedAPI } from '~/apis'
import { toast } from 'react-toastify'

function ArchivedCardsDrawer({ boardId, canEdit }) {
  const [open, setOpen] = useState(false)
  const [cards, setCards] = useState([])

  const loadCards = async () => {
    const archivedCards = await fetchArchivedCardsAPI(boardId)
    setCards(archivedCards)
  }

  const handleOpen = async () => {
    setOpen(true)
    await loadCards()
  }

  const restoreCard = async (cardId) => {
    await setCardArchivedAPI(cardId, false)
    setCards((current) => current.filter((card) => card._id !== cardId))
    toast.success('Card restored')
  }

  return <>
    <Button color='inherit' startIcon={<ArchiveOutlinedIcon />} onClick={handleOpen}>
      Archive
    </Button>
    <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 360, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ flex: 1 }}>Archived cards</Typography>
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </Box>
        {cards.length === 0 && <Typography color='text.secondary'>No archived cards</Typography>}
        <List>
          {cards.map((card) => (
            <ListItem
              key={card._id}
              secondaryAction={canEdit && (
                <Button onClick={() => restoreCard(card._id)}>Restore</Button>
              )}
            >
              <ListItemText
                primary={card.title}
                secondary={card.archivedAt
                  ? new Date(card.archivedAt).toLocaleString()
                  : undefined}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  </>
}

export default ArchivedCardsDrawer
