import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './modules/app/App'

const theme = createTheme({
  palette: {
    primary: { main: '#e75480' },
    secondary: { main: '#6b7280' },
    background: { default: '#f2f2f2' }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h3: { fontWeight: 800 }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

