import { httpClient } from './httpClient'

async function fetchPokemonByName(name) {
  const masters = await httpClient.get('/api/masters', { params: { q: name, limit: 1 } })
  const master = masters.data.items?.[0]
  if (!master || master.name.toLowerCase() !== name.toLowerCase()) {
    const err = new Error(`The pokemon "${name}" is not in the database.`)
    err.statusCode = 404
    throw err
  }
  if (master.status === 'inactive') {
    const err = new Error(`The pokemon "${name}" is currently inactive.`)
    err.statusCode = 404
    throw err
  }
  const abilitiesRes = await httpClient.get('/api/abilities', { params: { masterId: master.id, limit: 100 } })
  const activeAbilities = (abilitiesRes.data.items || []).filter(ability => ability.status === 'active')
  return { master, abilities: activeAbilities }
}

async function createMaster(masterData) {
  try {
    const formData = new FormData()
    formData.append('name', masterData.name)
    formData.append('status', masterData.status)
    if (masterData.image) {
      formData.append('image', masterData.image)
    }
    const response = await httpClient.post('/api/masters', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to create Pokemon'
    const e = new Error(message)
    e.statusCode = err.response?.status
    throw e
  }
}

async function updateMaster(id, masterData) {
  try {
    const formData = new FormData()
    formData.append('name', masterData.name)
    formData.append('status', masterData.status)
    if (masterData.image) {
      formData.append('image', masterData.image)
    }
    const response = await httpClient.put(`/api/masters/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update Pokemon'
    const e = new Error(message)
    e.statusCode = err.response?.status
    throw e
  }
}

async function deleteMaster(id) {
  const response = await httpClient.delete(`/api/masters/${id}`)
  return response.data
}

async function getAllMasters() {
  const response = await httpClient.get('/api/masters', { params: { limit: 100 } })
  return response.data.items || []
}

async function createAbility(abilityData) {
  const response = await httpClient.post('/api/abilities', abilityData)
  return response.data
}

async function updateAbility(id, abilityData) {
  const response = await httpClient.put(`/api/abilities/${id}`, abilityData)
  return response.data
}

async function deleteAbility(id) {
  const response = await httpClient.delete(`/api/abilities/${id}`)
  return response.data
}

async function getAbilitiesByMasterId(masterId) {
  const response = await httpClient.get('/api/abilities', { params: { masterId, limit: 100 } })
  return response.data.items || []
}

export const pokemonApi = { 
  fetchPokemonByName,
  createMaster,
  updateMaster,
  deleteMaster,
  getAllMasters,
  createAbility,
  updateAbility,
  deleteAbility,
  getAbilitiesByMasterId
}

