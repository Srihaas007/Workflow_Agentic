import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  ListItemButton,
  useTheme
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
  AutoAwesome as AIIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

const drawerWidth = 280;
const collapsedWidth = 64;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { 
    text: 'Workflows', 
    icon: <WorkflowIcon />, 
    path: '/workflow-builder',
    subItems: [
      { text: 'Workflow Builder', path: '/workflow-builder' },
      { text: 'My Workflows', path: '/workflows' },
      { text: 'Templates', path: '/workflow-templates' }
    ]
  },
  { text: 'Email Automation', icon: <EmailIcon />, path: '/email-automation' },
  { text: 'Task Scheduler', icon: <ScheduleIcon />, path: '/task-scheduler' },
  { text: 'API Hub', icon: <HubIcon />, path: '/api-hub' },
  { text: 'Workflow Advisor', icon: <AdvisorIcon />, path: '/workflow-advisor' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [workflowExpanded, setWorkflowExpanded] = useState(false);

  const handleItemClick = (item: any) => {
    if (item.subItems && open) {
      if (item.text === 'Workflows') {
        setWorkflowExpanded(!workflowExpanded);
      }
    } else {
      navigate(item.path);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path.replace('/workflow-builder', '/workflow'));
  };

  const DrawerHeader = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
        padding: theme.spacing(1, 2),
        minHeight: 64,
        backgroundColor: '#1a1f2e',
        borderBottom: '1px solid #2a3441'
      }}
    >
      {open && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AIIcon sx={{ color: '#00d4ff', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ 
              color: '#ffffff', 
              fontWeight: 600, 
              fontSize: '1.1rem',
              lineHeight: 1.2
            }}>
              AI Automation
            </Typography>
            <Typography variant="caption" sx={{ 
              color: '#b8c5d1',
              fontSize: '0.75rem'
            }}>
              Platform
            </Typography>
          </Box>
        </Box>
      )}
      {!open && (
        <AIIcon sx={{ color: '#00d4ff', fontSize: 32 }} />
      )}
      <IconButton 
        onClick={onToggle}
        sx={{ 
          color: '#b8c5d1',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            color: '#00d4ff'
          }
        }}
      >
        {open ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
    </Box>
  );

  const renderMenuItem = (item: any) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const active = isActive(item.path);
    
    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <Tooltip title={!open ? item.text : ''} placement="right">
            <ListItemButton
              onClick={() => handleItemClick(item)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: open ? 2 : 1.5,
                mx: open ? 1 : 0.5,
                borderRadius: 2,
                backgroundColor: active ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                borderLeft: active && open ? '3px solid #00d4ff' : open ? '3px solid transparent' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: active ? '#00d4ff' : '#b8c5d1',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <>
                  <ListItemText 
                    primary={item.text}
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        color: active ? '#ffffff' : '#b8c5d1',
                        fontWeight: active ? 600 : 400,
                        fontSize: '0.95rem',
                      }
                    }}
                  />
                  {hasSubItems && (
                    <Box sx={{ color: '#b8c5d1' }}>
                      {workflowExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        
        {/* Render sub-items */}
        {hasSubItems && open && (
          <Collapse in={workflowExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem: any) => (
                <ListItem key={subItem.text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => navigate(subItem.path)}
                    sx={{
                      pl: 5,
                      py: 1,
                      mx: 1,
                      borderRadius: 2,
                      backgroundColor: isActive(subItem.path) 
                        ? 'rgba(0, 212, 255, 0.08)' 
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 212, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={subItem.text}
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          fontSize: '0.875rem',
                          color: isActive(subItem.path) ? '#00d4ff' : '#b8c5d1',
                          fontWeight: isActive(subItem.path) ? 500 : 400
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1f2e',
          borderRight: '1px solid #2a3441',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DrawerHeader />
        <Divider sx={{ borderColor: '#2a3441' }} />
        
        {/* Menu Items */}
        <List sx={{ pt: 2, flex: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>

        {/* Footer Info */}
        {open && (
          <Box sx={{ p: 2, borderTop: '1px solid #2a3441' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#b8c5d1', 
                textAlign: 'center', 
                display: 'block',
                fontSize: '0.75rem'
              }}
            >
              AI-Powered Automation Platform v1.0
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;