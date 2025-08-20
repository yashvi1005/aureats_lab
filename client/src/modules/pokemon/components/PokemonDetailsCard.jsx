import { Box, Button, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import styles from './panel.module.css'
import { buildApiUrl } from '../../../shared/api/httpClient'

export function PokemonDetailsCard({ state, onTryAgain }) {
  const { isLoading, error, pokemon, lastQuery } = state

  if (!pokemon && !isLoading && !error) {
    return (
      <Paper variant="outlined" className={styles.dashedPanel} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No Pokemon Yet! (xxx)
        </Typography>
        <Box className={styles.errorInnerBox} sx={{ my: 2 }}>
          <Typography variant="body2">Please submit a pokemon!</Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ability</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Damage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell align="right">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  if (isLoading) {
    return (
      <Paper variant="outlined" className={styles.dashedPanel} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Loading {lastQuery || ''}... (xxx)
        </Typography>
        <Box sx={{ py: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      </Paper>
    )
  }

  if (error && !pokemon) {
    return (
      <Paper variant="outlined" className={styles.dashedPanel} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Error! :( (xxx)
        </Typography>
        <Box className={styles.errorInnerBox} sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Stack alignItems="center" spacing={1}>
            <Button variant="contained" color="error" size="small" onClick={onTryAgain}>
              Try again
            </Button>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              
            </Typography>
          </Stack>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ability</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Damage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell align="right">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  if (!pokemon) return null

  const { master, abilities } = pokemon

  return (
    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {master.name} ({String(master.id).padStart(3, '0')})
      </Typography>

             <Box sx={{ my: 3 }}>
        {master.hasImage ? (
          <img 
            src={buildApiUrl(`/api/masters/${master.id}/image`)}
            alt={master.name} 
            style={{ 
              width: 160, 
              height: 160, 
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #e0e0e0'
            }} 
          />
        ) : (
          <Box 
            sx={{ 
              width: 160, 
              height: 160, 
              bgcolor: 'grey.200', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
                        justifyContent: 'center',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Ability</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">Damage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(abilities || []).map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.ability}</TableCell>
              <TableCell>{a.type}</TableCell>
              <TableCell align="right">{a.damage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

