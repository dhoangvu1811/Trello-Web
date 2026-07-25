import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { attachmentFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

function CardAttachments({
  attachments = [],
  canEdit,
  onUpload,
  onDelete,
  onDownload
}) {
  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    const error = attachmentFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    try {
      await toast.promise(onUpload(file), { pending: 'Uploading attachment...' })
    } finally {
      event.target.value = ''
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AttachFileIcon />
        <Typography sx={{ fontWeight: 600, fontSize: 20, flex: 1 }}>
          Attachments
        </Typography>
        {canEdit && <Button component='label' variant='outlined' size='small'>
          Add
          <VisuallyHiddenInput type='file' onChange={handleUpload} />
        </Button>}
      </Box>
      {attachments.length === 0 ? (
        <Typography color='text.secondary' sx={{ mt: 1 }}>No attachments</Typography>
      ) : (
        <List dense>
          {attachments.map((attachment) => (
            <ListItem
              key={attachment._id}
              secondaryAction={canEdit && (
                <Button
                  color='error'
                  aria-label={`Delete ${attachment.name}`}
                  onClick={() => onDelete(attachment._id)}
                >
                  <DeleteOutlineIcon />
                </Button>
              )}
            >
              <ListItemText
                primary={
                  <Link
                    component='button'
                    type='button'
                    onClick={() => toast.promise(
                      onDownload(attachment),
                      { pending: `Downloading ${attachment.name}...` }
                    )}
                    sx={{ textAlign: 'left' }}
                  >
                    {attachment.name}
                  </Link>
                }
                secondary={`${Math.ceil(attachment.size / 1024)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default CardAttachments
