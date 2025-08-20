import { Box, Container, Paper, Stack, Typography, Tabs, Tab } from '@mui/material'
import { useState } from 'react'
import { PokemonSearch } from '../pokemon/components/PokemonSearch'
import { PokemonDetailsCard } from '../pokemon/components/PokemonDetailsCard'
import { PokemonManagement } from '../pokemon/components/PokemonManagement'
import { usePokemon } from '../pokemon/hooks/usePokemon'

export default function App() {
  const { state, fetchByName, resetError, resetAll } = usePokemon()
  const [resetForm, setResetForm] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  const handleTryAgain = () => {
    resetAll()
    if (resetForm) {
      resetForm()
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
        Aureate React Assignment Mockup
      </Typography>
      
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Search Pokemon" />
          <Tab label="Manage Pokemon" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <PokemonSearch
            onSubmit={fetchByName}
            onSampleClick={fetchByName}
            errorMessage={state.error}
            clearAndReset={resetAll}
            resetError={resetError}
            setResetForm={setResetForm}
          />
          <Box sx={{ mt: 3 }}>
            <PokemonDetailsCard state={state} onTryAgain={handleTryAgain} />
          </Box>
        </Paper>
      )}

      {activeTab === 1 && (
        <PokemonManagement />
      )}
    </Container>
  )
}

