import React from 'react'
import { Button } from '@mui/material'
import { ListPlus } from 'lucide-react'

interface CreateShoppingListButtonProps {
  onClick: () => void
}

export function CreateShoppingListButton({ onClick }: CreateShoppingListButtonProps) {
  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<ListPlus size={24} />}
      onClick={onClick}
      sx={{
        backgroundColor: '#2563eb',
        '&:hover': {
          backgroundColor: '#1d4ed8',
        },
        padding: '12px 24px',
        borderRadius: '12px',
        textTransform: 'none',
        fontSize: '1.1rem',
      }}
    >
      Create Shopping List
    </Button>
  )
}