import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountTree as WorkflowIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Hub as HubIcon,
  Psychology as AdvisorIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Workflow Builder', icon: <WorkflowIcon />, path: '/workflow-builder' },
  { text: 'Email Automation', icon: <EmailIcon />, path: '/email-automation' },
  { text: 'Task Scheduler', icon: <ScheduleIcon />, path: '/task-scheduler' },
  { text: 'API Hub', icon: <HubIcon />, path: '/api-hub' },
  { text: 'Workflow Advisor', icon: <AdvisorIcon />, path: '/workflow-advisor' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1f2e',
          borderRight: '1px solid #2a3441',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        {/* Logo/Brand */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <AIIcon sx={{ color: '#00d4ff', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              AI Automation
            </Typography>
            <Typography variant="caption" sx={{ color: '#b8c5d1' }}>
              Platform
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#2a3441' }} />

        {/* Menu Items */}
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: 'pointer',
                mx: 1,
                borderRadius: 2,
                mb: 1,
                backgroundColor: location.pathname === item.path ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid #00d4ff' : '3px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#00d4ff' : '#b8c5d1',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? '#ffffff' : '#b8c5d1',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Footer Info */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
          <Divider sx={{ borderColor: '#2a3441', mb: 2 }} />
          <Typography variant="caption" sx={{ color: '#b8c5d1', textAlign: 'center', display: 'block' }}>
            AI-Powered Automation Platform v1.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;