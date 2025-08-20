import { useCallback, useMemo, useRef, useState } from 'react'
import { pokemonApi } from '../../../shared/api/pokemonApi'

export function usePokemon() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const lastQueryRef = useRef('')

  const fetchByName = useCallback(async (name) => {
    const trimmed = String(name || '').trim()
    lastQueryRef.current = trimmed
    if (!trimmed) {
      setPokemon(null)
      setError('')
      return
    }
    try {
      setError('')
      setIsLoading(true)
      const data = await pokemonApi.fetchPokemonByName(trimmed)
      setPokemon(data)
    } catch (e) {
      setPokemon(null)
      setError(e?.response?.data?.message || e.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetError = useCallback(() => setError(''), [])
  const resetAll = useCallback(() => {
    lastQueryRef.current = ''
    setPokemon(null)
    setError('')
  }, [])

  const state = useMemo(() => ({ isLoading, error, pokemon, lastQuery: lastQueryRef.current }), [isLoading, error, pokemon])

  return { state, fetchByName, resetError, resetAll }
}

