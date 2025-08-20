import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  FormHelperText, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  Collapse,
  Chip
} from '@mui/material'
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { pokemonApi } from '../../../shared/api/pokemonApi'
import { buildApiUrl } from '../../../shared/api/httpClient'

const masterSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name is too long'),
  image: z.instanceof(File, { message: 'Image is required' }),
  status: z.string().min(1, 'Status is required')
})

const abilitySchema = z.object({
  masterId: z.number().min(1, 'Master ID is required'),
  ability: z.string().trim().min(1, 'Ability name is required').max(50, 'Ability name is too long'),
  type: z.string().trim().min(1, 'Type is required').max(20, 'Type is too long'),
  damage: z.number().min(0, 'Damage must be 0 or greater').max(999, 'Damage is too high'),
  status: z.string().min(1, 'Status is required')
})

export function PokemonManagement() {
  const [masters, setMasters] = useState([])
  const [abilitiesMap, setAbilitiesMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [masterDialogOpen, setMasterDialogOpen] = useState(false)
  const [abilityDialogOpen, setAbilityDialogOpen] = useState(false)
  const [editingMaster, setEditingMaster] = useState(null)
  const [editingAbility, setEditingAbility] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [masterDialogError, setMasterDialogError] = useState('')
  const [abilityDialogError, setAbilityDialogError] = useState('')

  const masterForm = useForm({
    defaultValues: { name: '', image: null, status: 'active' },
    resolver: zodResolver(masterSchema),
    mode: 'onSubmit'
  })

  const abilityForm = useForm({
    defaultValues: { masterId: '', ability: '', type: '', damage: 0, status: 'active' },
    resolver: zodResolver(abilitySchema),
    mode: 'onSubmit'
  })

  useEffect(() => {
    loadMasters()
  }, [])

  const loadMasters = async () => {
    try {
      setLoading(true)
      const mastersData = await pokemonApi.getAllMasters()
      setMasters(mastersData)
      
      const abilitiesData = {}
      for (const master of mastersData) {
        try {
          const abilities = await pokemonApi.getAbilitiesByMasterId(master.id)
          abilitiesData[master.id] = abilities
        } catch (err) {
          console.error(`Failed to load abilities for master ${master.id}:`, err)
          abilitiesData[master.id] = []
        }
      }
      setAbilitiesMap(abilitiesData)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load Pokemon masters')
    } finally {
      setLoading(false)
    }
  }

  const loadAbilitiesForMaster = async (masterId) => {
    try {
      const abilities = await pokemonApi.getAbilitiesByMasterId(masterId)
      setAbilitiesMap(prev => ({
        ...prev,
        [masterId]: abilities
      }))
    } catch (err) {
      console.error('Failed to load abilities:', err)
    }
  }

  const handleCreateMaster = async (data) => {
    try {
      setLoading(true)
      setMasterDialogError('')
      const newMaster = await pokemonApi.createMaster(data)
      setMasterDialogOpen(false)
      masterForm.reset()
      await loadMasters()
      setError('')
    } catch (err) {
      setMasterDialogError(err.message || 'Failed to create Pokemon master')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMaster = async (data) => {
    try {
      setLoading(true)
      setMasterDialogError('')
      await pokemonApi.updateMaster(editingMaster.id, data)
      setMasterDialogOpen(false)
      setEditingMaster(null)
      masterForm.reset()
      await loadMasters()
      setError('')
    } catch (err) {
      setMasterDialogError(err.message || 'Failed to update Pokemon master')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMaster = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Pokemon? This will also delete all its abilities.')) {
      return
    }
    try {
      setLoading(true)
      await pokemonApi.deleteMaster(id)
      await loadMasters()
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to delete Pokemon master')
    } finally {
      setLoading(false)
    }
  }

  const openEditMaster = (master) => {
    setEditingMaster(master)
    setMasterDialogError('')
    masterForm.reset({
      name: master.name,
      image: null,
      status: master.status
    })
    setMasterDialogOpen(true)
  }

  const openCreateMaster = () => {
    setEditingMaster(null)
    setMasterDialogError('')
    masterForm.reset({ name: '', image: null, status: 'active' })
    setMasterDialogOpen(true)
  }

  const handleCreateAbility = async (data) => {
    try {
      setLoading(true)
      setAbilityDialogError('')
      await pokemonApi.createAbility(data)
      setAbilityDialogOpen(false)
      abilityForm.reset()
      await loadAbilitiesForMaster(data.masterId)
      setError('')
    } catch (err) {
      setAbilityDialogError(err.message || 'Failed to create ability')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAbility = async (data) => {
    try {
      setLoading(true)
      setAbilityDialogError('')
      await pokemonApi.updateAbility(editingAbility.id, data)
      setAbilityDialogOpen(false)
      setEditingAbility(null)
      abilityForm.reset()
      await loadAbilitiesForMaster(data.masterId)
      setError('')
    } catch (err) {
      setAbilityDialogError(err.message || 'Failed to update ability')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAbility = async (id, masterId) => {
    if (!window.confirm('Are you sure you want to delete this ability?')) {
      return
    }
    try {
      setLoading(true)
      await pokemonApi.deleteAbility(id)
      await loadAbilitiesForMaster(masterId)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to delete ability')
    } finally {
      setLoading(false)
    }
  }

  const openEditAbility = (ability) => {
    setEditingAbility(ability)
    setAbilityDialogError('')
    abilityForm.reset({
      masterId: ability.masterId,
      ability: ability.ability,
      type: ability.type,
      damage: ability.damage,
      status: ability.status
    })
    setAbilityDialogOpen(true)
  }

  const openCreateAbility = (masterId) => {
    setEditingAbility(null)
    setAbilityDialogError('')
    abilityForm.reset({ 
      masterId: masterId, 
      ability: '', 
      type: '', 
      damage: 0, 
      status: 'active' 
    })
    setAbilityDialogOpen(true)
  }

  const toggleRowExpansion = (masterId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(masterId)) {
      newExpanded.delete(masterId)
    } else {
      newExpanded.add(masterId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Pokemon Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateMaster}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Add Pokemon
        </Button>
      </Stack>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Abilities</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {masters.map((master) => {
              const abilities = abilitiesMap[master.id] || []
              const isExpanded = expandedRows.has(master.id)
              
              return (
                <>
                  <TableRow key={master.id} hover>
                    <TableCell>{master.id}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {master.name}
                      </Typography>
                    </TableCell>
                                     <TableCell>
                   {master.hasImage ? (
                     <img 
                       src={buildApiUrl(`/api/masters/${master.id}/image`)}
                       alt={master.name} 
                       style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                     />
                   ) : (
                     <Box 
                       sx={{ 
                         width: 50, 
                         height: 50, 
                         bgcolor: 'grey.200', 
                         borderRadius: 1,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center'
                       }}
                     >
                       <Typography variant="caption" color="text.secondary">
                         No Image
                       </Typography>
                     </Box>
                   )}
                 </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: master.status === 'active' ? 'success.main' : 'error.main',
                          fontWeight: 600
                        }}
                      >
                        {master.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {abilities.length} abilities
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleRowExpansion(master.id)}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton 
                          size="small" 
                          onClick={() => openEditMaster(master)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteMaster(master.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openCreateAbility(master.id)}
                          sx={{ textTransform: 'none' }}
                        >
                          Add Ability
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  
                  
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Abilities
                          </Typography>
                          {abilities.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                                  <TableCell sx={{ fontWeight: 700 }}>Ability</TableCell>
                                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                  <TableCell sx={{ fontWeight: 700 }} align="right">Damage</TableCell>
                                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                  <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {abilities.map((ability) => (
                                  <TableRow key={ability.id} hover>
                                    <TableCell>{ability.id}</TableCell>
                                    <TableCell>{ability.ability}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={ability.type} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                      />
                                    </TableCell>
                                    <TableCell align="right">{ability.damage}</TableCell>
                                    <TableCell>
                                      <Typography 
                                        sx={{ 
                                          color: ability.status === 'active' ? 'success.main' : 'error.main',
                                          fontWeight: 600,
                                          fontSize: '0.875rem'
                                        }}
                                      >
                                        {ability.status}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton 
                                          size="small" 
                                          onClick={() => openEditAbility(ability)}
                                          color="primary"
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => handleDeleteAbility(ability.id, ability.masterId)}
                                          color="error"
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                              No abilities found for this Pokemon
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Dialog open={masterDialogOpen} onClose={() => setMasterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMaster ? 'Edit Pokemon' : 'Add New Pokemon'}
        </DialogTitle>
        <Box component="form" onSubmit={masterForm.handleSubmit(editingMaster ? handleUpdateMaster : handleCreateMaster)}>
          <DialogContent>
            <Stack spacing={3}>
              {masterDialogError && (
                <Paper sx={{ p: 1.5, bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="body2">{masterDialogError}</Typography>
                </Paper>
              )}
              <Controller
                control={masterForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Pokemon Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
                             <Controller
                 control={masterForm.control}
                 name="image"
                 render={({ field, fieldState }) => (
                   <Box>
                     <input
                       type="file"
                       accept="image/*"
                       onChange={(e) => {
                         const file = e.target.files?.[0]
                         field.onChange(file)
                       }}
                       style={{ display: 'none' }}
                       id="image-upload"
                     />
                     <label htmlFor="image-upload">
                       <Button
                         variant="outlined"
                         component="span"
                         fullWidth
                         sx={{ mb: 1 }}
                       >
                         {field.value ? field.value.name : 'Choose Image File'}
                       </Button>
                     </label>
                     {field.value && (
                       <Typography variant="caption" color="text.secondary">
                         Selected: {field.value.name}
                       </Typography>
                     )}
                     {fieldState.error && (
                       <Typography variant="caption" color="error">
                         {fieldState.error.message}
                       </Typography>
                     )}
                   </Box>
                 )}
               />
              <Controller
                control={masterForm.control}
                name="status"
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMasterDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {loading ? 'Saving...' : (editingMaster ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      
      <Dialog open={abilityDialogOpen} onClose={() => setAbilityDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAbility ? 'Edit Ability' : 'Add New Ability'}
        </DialogTitle>
        <Box component="form" onSubmit={abilityForm.handleSubmit(editingAbility ? handleUpdateAbility : handleCreateAbility)}>
          <DialogContent>
            <Stack spacing={3}>
              {abilityDialogError && (
                <Paper sx={{ p: 1.5, bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="body2">{abilityDialogError}</Typography>
                </Paper>
              )}
              <Controller
                control={abilityForm.control}
                name="masterId"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Master ID"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Controller
                control={abilityForm.control}
                name="ability"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Ability Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={abilityForm.control}
                name="type"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Type"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={abilityForm.control}
                name="damage"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Damage"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Controller
                control={abilityForm.control}
                name="status"
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAbilityDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {loading ? 'Saving...' : (editingAbility ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
} 