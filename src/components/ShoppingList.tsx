import { Box, Typography } from '@mui/material'
import { ShoppingListItem } from '../models/ShoppingList'

interface ShoppingListProps {
  items: ShoppingListItem[]
}

export function ShoppingList({ items }: ShoppingListProps) {
  if (items.length === 0) return null

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '600px',
        mt: 4,
        p: 3,
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#1e40af' }}>
        Your Shopping List
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 3 }}>
        {items.map((item, index) => (
          <Typography
            component="li"
            key={index}
            sx={{
              mb: 1,
              color: '#374151',
              fontSize: '1.1rem',
            }}
          >
            {item.name}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}