import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormHelperText, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1, 'Please enter a Pokemon name').max(50, 'Name is too long')
})

export function PokemonSearch({ onSubmit, onSampleClick, errorMessage, clearAndReset, resetError, setResetForm }) {
  const { handleSubmit, control, setValue, watch, resetField } = useForm({
    defaultValues: { name: '' },
    resolver: zodResolver(schema),
    mode: 'onSubmit'
  })
  const inputRef = useRef(null)

  useEffect(() => {
    if (setResetForm) {
      setResetForm(() => () => {
        resetField('name')
        inputRef.current?.focus()
      })
    }
  }, [setResetForm, resetField])

  const submitHandler = (values) => onSubmit(values.name)

  const handleSample = (sample) => {
    setValue('name', sample, { shouldValidate: true })
    onSampleClick(sample)
  }

  const handleTryAgain = () => {
    clearAndReset()
    resetField('name')
    inputRef.current?.focus()
  }

  const current = watch('name')

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate>
      <Stack direction="row" spacing={2} alignItems="center">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              inputRef={inputRef}
              label="Which pokemon?"
              placeholder="Pikachu"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message || ' '}
              onChange={(e) => {
                if (errorMessage) resetError()
                field.onChange(e)
              }}
            />
          )}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Fetch!
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mt: -1, mb: 1, color: 'text.secondary' }}>
        Try{' '}
        <Box component="span" onClick={() => handleSample('Pikachu')} sx={{ color: 'primary.main', cursor: 'pointer' }}>Pikachu</Box>
        ,{' '}
        <Box component="span" onClick={() => handleSample('Charizard')} sx={{ color: 'primary.main', cursor: 'pointer' }}>Charizard</Box>
        , or{' '}
        <Box component="span" onClick={() => handleSample('Ninetales')} sx={{ color: 'primary.main', cursor: 'pointer' }}>Ninetales</Box>
        .
      </Typography>

      <FormHelperText sx={{ minHeight: 24 }}>&nbsp;</FormHelperText>
    </Box>
  )
}

