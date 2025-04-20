import React from 'react'
import { 
  Box, 
  Modal, 
  Typography, 
  TextField, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material'

interface CreateShoppingListModalProps {
  open: boolean
  onClose: () => void
  inputText: string
  onInputChange: (value: string) => void
  onCreateList: () => void
  isLoading: boolean
  error: string | null
}

export function CreateShoppingListModal({
  open,
  onClose,
  inputText,
  onInputChange,
  onCreateList,
  isLoading,
  error
}: CreateShoppingListModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Create Your Shopping List
        </Typography>
        <Typography id="modal-description" sx={{ mb: 3, color: 'text.secondary' }}>
          Write your shopping list in natural language (e.g., "I need milk, eggs, and bread for breakfast")
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          multiline
          rows={4}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter your shopping list..."
          sx={{ mb: 3 }}
          error={!!error}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onCreateList}
            variant="contained"
            disabled={isLoading || !inputText.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            Create List
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}