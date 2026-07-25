import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import CardDetailsPanel from './CardDetailsPanel'
import CardAttachments from './CardAttachments'

import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  selectIsShowModalActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import {
  copyCardAPI,
  deleteCardAttachmentAPI,
  moveCardAPI,
  setCardArchivedAPI,
  updateCardDetailsAPI,
  uploadCardAttachmentAPI
} from '~/apis'
import {
  selectCurrentActiveBoard,
  updateCardInBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { canEditBoardContent } from '~/utils/boardPermissions'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useConfirm } from 'material-ui-confirm'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const activeCard = useSelector(selectCurrentActiveCard)
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const canEdit = canEditBoardContent(activeBoard?.currentUserRole)
  const [actionTargetColumnId, setActionTargetColumnId] = useState('')
  const confirmArchive = useConfirm()
  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)

  const handleCloseModal = () => {
    // setIsOpen(false)
    dispatch(clearAndHideCurrentActiveCard())
  }

  // Func gọi API dùng chung cho việc update Card như title, cover, description,....
  const callAPIUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard?._id, updateData)

    //B1: Cập nhật lại cái card đang active trong modal hiện tại
    dispatch(updateCurrentActiveCard(updatedCard))

    //B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
    dispatch(updateCardInBoard(updatedCard))

    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    // Gọi API...
    callAPIUpdateCard({ title: newTitle })
  }

  const onUpdateCardDesription = (newDescription) => {
    callAPIUpdateCard({ description: newDescription })
  }

  const onUploadCardCover = (event) => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callAPIUpdateCard(reqData).finally(() => (event.target.value = '')),
      {
        pending: 'Updating...'
      }
    )
  }

  // Dùng async/await ở đây để component con CardActivitySection chờ và nếu thành công thì mới clear thẻ input comment
  const onAddCardComment = async (commentToAdd) => {
    await callAPIUpdateCard({ commentToAdd })
  }

  const onUpdateCardComment = async (commentId, content) =>
    await callAPIUpdateCard({ commentToUpdate: { commentId, content } })

  const onDeleteCardComment = async (commentId) =>
    await callAPIUpdateCard({ commentToDelete: { commentId } })

  const onReactCardComment = async (commentId, emoji) =>
    await callAPIUpdateCard({ commentReaction: { commentId, emoji } })

  const onUploadAttachment = async (file) => {
    const updatedCard = await uploadCardAttachmentAPI(activeCard._id, file)
    dispatch(updateCurrentActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))
  }

  const onDeleteAttachment = async (attachmentId) => {
    const updatedCard = await deleteCardAttachmentAPI(activeCard._id, attachmentId)
    dispatch(updateCurrentActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))
  }

  const selectedColumnId = actionTargetColumnId || activeCard?.columnId || ''

  const handleMoveCard = async () => {
    if (selectedColumnId === activeCard.columnId) return
    await toast.promise(moveCardAPI(activeCard._id, selectedColumnId), {
      pending: 'Moving card...',
      success: 'Card moved'
    })
    handleCloseModal()
  }

  const handleCopyCard = async () => {
    await toast.promise(copyCardAPI(activeCard._id, selectedColumnId), {
      pending: 'Copying card...',
      success: 'Card copied'
    })
  }

  const handleArchiveCard = async () => {
    try {
      await confirmArchive({
        title: 'Archive this card?',
        description: 'The card can be restored from the board archive.'
      })
      await setCardArchivedAPI(activeCard._id, true)
      handleCloseModal()
      toast.success('Card archived')
    } catch {
      // Cancellation leaves the card unchanged.
    }
  }

  const handleShareCard = async () => {
    const url = `${window.location.origin}/boards/${activeBoard._id}?cardId=${activeCard._id}`
    await navigator.clipboard.writeText(url)
    toast.success('Card link copied')
  }

  const onUpdateCardMembers = (incommingMemberInfo) => {
    callAPIUpdateCard({ incommingMemberInfo })
  }

  const handleUpdateCardMember = (userId) => {
    const incommingMemberInfo = {
      userId: userId,
      action: activeCard?.memberIds?.includes(userId)
        ? CARD_MEMBER_ACTIONS.REMOVE
        : CARD_MEMBER_ACTIONS.ADD
    }
    callAPIUpdateCard({ incommingMemberInfo })
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon
            color='error'
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={handleCloseModal}
          />
        </Box>

        {activeCard?.cover && (
          <Box sx={{ mb: 4 }}>
            <img
              style={{
                width: '100%',
                height: '320px',
                borderRadius: '6px',
                objectFit: 'cover'
              }}
              src={activeCard?.cover}
              alt='card-cover'
            />
          </Box>
        )}

        <Box
          sx={{
            mb: 1,
            mt: -3,
            pr: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle}
            disabled={!canEdit}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
              >
                Members
              </Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
                canEdit={canEdit}
              />
            </Box>

            <CardDetailsPanel
              key={activeCard?._id}
              card={activeCard}
              currentUserId={currentUser?._id}
              canEdit={canEdit}
              onUpdate={callAPIUpdateCard}
            />

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography
                  variant='span'
                  sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                  Description
                </Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDesription={onUpdateCardDesription}
                canEdit={canEdit}
              />
            </Box>

            <CardAttachments
              attachments={activeCard?.attachments}
              canEdit={canEdit}
              onUpload={onUploadAttachment}
              onDelete={onDeleteAttachment}
            />

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography
                  variant='span'
                  sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                  Activity
                </Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
                onUpdateCardComment={onUpdateCardComment}
                onDeleteCardComment={onDeleteCardComment}
                onReactCardComment={onReactCardComment}
                canComment={canEdit}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Add To Card
            </Typography>
            <Stack direction='column' spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {canEdit && <SidebarItem
                className='active'
                onClick={() => handleUpdateCardMember(currentUser?._id)}
              >
                <PersonOutlineOutlinedIcon fontSize='small' />
                {activeCard?.memberIds?.includes(currentUser?._id)
                  ? 'Leave'
                  : 'Join'}
              </SidebarItem>}
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              {canEdit && <SidebarItem className='active' component='label'>
                <ImageOutlinedIcon fontSize='small' />
                Cover
                <VisuallyHiddenInput type='file' onChange={onUploadCardCover} />
              </SidebarItem>}

              <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize='small' />
                Custom Fields
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Power-Ups
            </Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem>
                <AspectRatioOutlinedIcon fontSize='small' />
                Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlinedIcon fontSize='small' />
                Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlinedIcon fontSize='small' />
                Add Power-Ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Actions
            </Typography>
            <Stack direction='column' spacing={1}>
              {canEdit && <TextField
                select
                size='small'
                label='Target column'
                value={selectedColumnId}
                disabled={!canEdit}
                onChange={(event) => setActionTargetColumnId(event.target.value)}
              >
                {(activeBoard?.columns || []).map((column) => (
                  <MenuItem key={column._id} value={column._id}>{column.title}</MenuItem>
                ))}
              </TextField>}
              {canEdit && <SidebarItem onClick={handleMoveCard}>
                <ArrowForwardOutlinedIcon fontSize='small' />
                Move
              </SidebarItem>}
              {canEdit && <SidebarItem onClick={handleCopyCard}>
                <ContentCopyOutlinedIcon fontSize='small' />
                Copy
              </SidebarItem>}
              {canEdit && <SidebarItem
                data-testid='archive-active-card'
                onClick={handleArchiveCard}
              >
                <ArchiveOutlinedIcon fontSize='small' />
                Archive
              </SidebarItem>}
              <SidebarItem onClick={handleShareCard}>
                <ShareOutlinedIcon fontSize='small' />
                Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
