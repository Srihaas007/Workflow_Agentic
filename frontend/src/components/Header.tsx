import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#1a1f2e',
        borderBottom: '1px solid #2a3441',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Current page info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 500 }}>
            AI-Powered Automation Platform
          </Typography>
          <Chip
            label="Beta"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 107, 53, 0.2)',
              color: '#ff6b35',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          />
        </Box>

        {/* Right side - Actions and profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Status indicator */}
          <Chip
            label="AI Services Active"
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          />

          {/* Notifications */}
          <IconButton sx={{ color: '#b8c5d1' }}>
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton sx={{ color: '#b8c5d1' }}>
            <SettingsIcon />
          </IconButton>

          {/* Profile Menu */}
          <IconButton onClick={handleProfileClick} sx={{ color: '#b8c5d1' }}>
            <Avatar
              sx={{
                bgcolor: '#00d4ff',
                width: 32,
                height: 32,
                fontSize: '0.875rem'
              }}
            >
              AI
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#1a1f2e',
                border: '1px solid #2a3441',
                minWidth: 200,
              }
            }}
          >
            <MenuItem onClick={handleClose} sx={{ color: '#ffffff' }}>
              <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: '#ffffff' }}>
              <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#ff6b35' }}>
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;