import React, { useState, useEffect } from 'react'
import { Box, AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import CallDurationChart from './components/CallDurationChart'
import SadPathChart from './components/SadPathChart'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import { SnackbarProvider } from './components/SnackbarProvider'
import { useTheme as useCustomTheme } from './theme/theme'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const muiTheme = useTheme()
  const { mode, toggleTheme } = useCustomTheme()

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    setSelectedChart(null)
  }

  const renderContent = () => {
    if (selectedChart === null) {
      // Dashboard view - show all charts
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div className="chart-wrapper">
            <CallDurationChart />
          </div>
          <div className="chart-wrapper">
            <SadPathChart />
          </div>
        </Box>
      )
    } else if (selectedChart === 'call-duration') {
      return (
        <div className="chart-wrapper">
          <CallDurationChart />
        </div>
      )
    } else if (selectedChart === 'sad-path') {
      return (
        <div className="chart-wrapper">
          <SadPathChart />
        </div>
      )
    }
    return null
  }

  if (!isLoggedIn) {
    return (
      <SnackbarProvider>
        <Login onLogin={handleLogin} />
      </SnackbarProvider>
    )
  }

  const username = localStorage.getItem('username') || 'User'

  return (
    <SnackbarProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: muiTheme.palette.background.default }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedChart={selectedChart}
          onSelectChart={setSelectedChart}
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
            transition: 'width 0.3s',
            backgroundColor: muiTheme.palette.background.default,
          }}
        >
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
              transition: 'width 0.3s',
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Call Analytics Dashboard
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mr: 2, 
                  color: muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#6b7280' 
                }}
              >
                Welcome, {username}
              </Typography>
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                aria-label="toggle theme"
                sx={{ mr: 1 }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Box 
            sx={{ 
              mt: 8,
              '& .chart-wrapper': {
                  backgroundColor: muiTheme.palette.background.paper,
                  boxShadow: muiTheme.palette.mode === 'dark' 
                    ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                },
                '& .chart-wrapper:hover': {
                  boxShadow: muiTheme.palette.mode === 'dark' 
                    ? '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)'
                    : '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                },
              }}
            >
              {renderContent()}
            </Box>
        </Box>
      </Box>
    </SnackbarProvider>
  )
}

export default App
