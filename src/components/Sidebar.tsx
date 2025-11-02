import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material'

interface SidebarProps {
  open: boolean
  selectedChart: string | null
  onSelectChart: (chart: string | null) => void
}

const drawerWidth = 280

const Sidebar: React.FC<SidebarProps> = ({ open, selectedChart, onSelectChart }) => {
  const theme = useTheme()
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'call-duration', label: 'Call Duration Analysis', icon: <BarChartIcon /> },
    { id: 'sad-path', label: 'Sad Path Analysis', icon: <PieChartIcon /> },
  ]

  const handleItemClick = (id: string) => {
    if (id === 'dashboard') {
      onSelectChart(null)
    } else {
      onSelectChart(id)
    }
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          position: 'relative',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Typography
          variant="h6"
          sx={{
            p: 2,
            fontWeight: 600,
            color: theme.palette.primary.main,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          Analytics Menu
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedChart === item.id || (item.id === 'dashboard' && selectedChart === null)}
                onClick={() => handleItemClick(item.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(102, 126, 234, 0.16)' 
                      : 'rgba(102, 126, 234, 0.08)',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(102, 126, 234, 0.24)' 
                        : 'rgba(102, 126, 234, 0.12)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedChart === item.id || (item.id === 'dashboard' && selectedChart === null)
                      ? theme.palette.primary.main
                      : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: selectedChart === item.id || (item.id === 'dashboard' && selectedChart === null)
                      ? 600
                      : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar

