import React, { useState } from 'react'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useSnackbar } from './SnackbarProvider'

interface LoginProps {
  onLogin: () => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loginIdError, setLoginIdError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { showSnackbar } = useSnackbar()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginIdError('')
    setPasswordError('')
    setError('')

    let hasError = false

    if (!loginId.trim()) {
      setLoginIdError('Login ID is required')
      hasError = true
    }

    if (!password.trim()) {
      setPasswordError('Password is required')
      hasError = true
    }

    if (hasError) {
      return
    }

    if (loginId === 'tharane' && password === 'Thara@0808') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', loginId)
      showSnackbar('Login successful!', 'success')
      // Small delay to show the snackbar before navigating
      setTimeout(() => {
        onLogin()
      }, 500)
    } else {
      setError('Invalid login credentials. Please try again.')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Call Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please login to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="loginId"
              label="Login ID"
              name="loginId"
              autoComplete="username"
              autoFocus
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value)
                setLoginIdError('')
              }}
              sx={{ mb: loginIdError ? 0.5 : 2 }}
            />
            {loginIdError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1.5, ml: 1.5 }}>
                {loginIdError}
              </Typography>
            )}
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              sx={{ mb: passwordError ? 0.5 : 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2, ml: 1.5 }}>
                {passwordError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login

