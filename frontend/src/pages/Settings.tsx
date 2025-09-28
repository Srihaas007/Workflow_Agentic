import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    timezone: 'America/New_York',
    language: 'en',
    theme: 'dark'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    workflowSuccess: true,
    workflowFailure: true,
    weeklyReports: false,
    systemUpdates: true,
    securityAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const [apiKeys] = useState([
    { id: '1', name: 'Production API', key: 'sk_prod_****', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development API', key: 'sk_dev_****', created: '2024-01-10', lastUsed: '1 day ago' },
    { id: '3', name: 'Testing API', key: 'sk_test_****', created: '2024-01-05', lastUsed: '3 days ago' }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUserSettingChange = (field: string, value: any) => {
    setUserSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { label: 'Profile', icon: <PersonIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'API Keys', icon: <ApiIcon /> },
    { label: 'Preferences', icon: <SettingsIcon /> }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          ⚙️ Settings
        </Typography>
        <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
          Configure your AI Automation Platform preferences and integrations
        </Typography>
      </Box>

      <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#2a3441' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#00d4ff' },
              '& .MuiTab-root': { color: '#b8c5d1' },
              '& .Mui-selected': { color: '#00d4ff !important' }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      backgroundColor: '#00d4ff',
                      fontSize: '3rem'
                    }}
                  >
                    JD
                  </Avatar>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ borderColor: '#00d4ff', color: '#00d4ff' }}
                  >
                    Change Photo
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={userSettings.name}
                      onChange={(e) => handleUserSettingChange('name', e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={userSettings.email}
                      onChange={(e) => handleUserSettingChange('email', e.target.value)}
                      sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#b8c5d1' }}>Timezone</InputLabel>
                      <Select
                        value={userSettings.timezone}
                        onChange={(e) => handleUserSettingChange('timezone', e.target.value)}
                        sx={{ color: '#ffffff' }}
                      >
                        <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                        <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                        <MenuItem value="Europe/London">GMT (London)</MenuItem>
                        <MenuItem value="Europe/Paris">CET (Paris)</MenuItem>
                        <MenuItem value="Asia/Tokyo">JST (Tokyo)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#b8c5d1' }}>Language</InputLabel>
                      <Select
                        value={userSettings.language}
                        onChange={(e) => handleUserSettingChange('language', e.target.value)}
                        sx={{ color: '#ffffff' }}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="ja">Japanese</MenuItem>
                        <MenuItem value="zh">Chinese</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordDialog(true)}
                    sx={{ borderColor: '#2a3441', color: '#b8c5d1' }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>
              Security Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon sx={{ color: '#00d4ff' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security to your account"
                  sx={{
                    '& .MuiListItemText-primary': { color: '#ffffff' },
                    '& .MuiListItemText-secondary': { color: '#b8c5d1' }
                  }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                    sx={{
                      '& .Mui-checked': { color: '#00d4ff' },
                      '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00d4ff' }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider sx={{ backgroundColor: '#2a3441' }} />
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon sx={{ color: '#ff9800' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Session Timeout"
                  secondary="Automatically log out after inactivity"
                  sx={{
                    '& .MuiListItemText-primary': { color: '#ffffff' },
                    '& .MuiListItemText-secondary': { color: '#b8c5d1' }
                  }}
                />
                <ListItemSecondaryAction>
                  <FormControl size="small">
                    <Select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      sx={{ color: '#ffffff', minWidth: 100 }}
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                      <MenuItem value={480}>8 hours</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider sx={{ backgroundColor: '#2a3441' }} />
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Password Expiry"
                  secondary="Require password change after specified days"
                  sx={{
                    '& .MuiListItemText-primary': { color: '#ffffff' },
                    '& .MuiListItemText-secondary': { color: '#b8c5d1' }
                  }}
                />
                <ListItemSecondaryAction>
                  <FormControl size="small">
                    <Select
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                      sx={{ color: '#ffffff', minWidth: 100 }}
                    >
                      <MenuItem value={30}>30 days</MenuItem>
                      <MenuItem value={60}>60 days</MenuItem>
                      <MenuItem value={90}>90 days</MenuItem>
                      <MenuItem value={180}>180 days</MenuItem>
                      <MenuItem value={365}>1 year</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>
              Notification Preferences
            </Typography>
            <List>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <React.Fragment key={key}>
                  <ListItem>
                    <ListItemIcon>
                      {key.includes('email') || key.includes('reports') ? 
                        <EmailIcon sx={{ color: '#4caf50' }} /> : 
                        <NotificationsIcon sx={{ color: '#00d4ff' }} />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      secondary={getNotificationDescription(key)}
                      sx={{
                        '& .MuiListItemText-primary': { color: '#ffffff' },
                        '& .MuiListItemText-secondary': { color: '#b8c5d1' }
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        sx={{
                          '& .Mui-checked': { color: '#00d4ff' },
                          '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00d4ff' }
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider sx={{ backgroundColor: '#2a3441' }} />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </TabPanel>

        {/* API Keys Tab */}
        <TabPanel value={tabValue} index={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                API Keys
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowApiDialog(true)}
                sx={{ background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)' }}
              >
                Generate API Key
              </Button>
            </Box>
            <List>
              {apiKeys.map((apiKey, index) => (
                <React.Fragment key={apiKey.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      <ApiIcon sx={{ color: '#00d4ff' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ color: '#ffffff' }}>
                            {apiKey.name}
                          </Typography>
                          <Chip
                            label={apiKey.key}
                            size="small"
                            sx={{
                              backgroundColor: '#2a3441',
                              color: '#b8c5d1',
                              fontFamily: 'monospace'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#b8c5d1' }}>
                            Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: '#b8c5d1' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#f44336' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < apiKeys.length - 1 && <Divider sx={{ backgroundColor: '#2a3441' }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </TabPanel>

        {/* Preferences Tab */}
        <TabPanel value={tabValue} index={4}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>
              Application Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#b8c5d1' }}>Theme</InputLabel>
                  <Select
                    value={userSettings.theme}
                    onChange={(e) => handleUserSettingChange('theme', e.target.value)}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="dark">Dark Theme</MenuItem>
                    <MenuItem value="light">Light Theme</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#b8c5d1' }}>Default View</InputLabel>
                  <Select
                    value="dashboard"
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="dashboard">Dashboard</MenuItem>
                    <MenuItem value="workflows">Workflows</MenuItem>
                    <MenuItem value="analytics">Analytics</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3, backgroundColor: '#00d4ff20', color: '#00d4ff' }}>
              Changes to preferences will take effect immediately.
            </Alert>
          </CardContent>
        </TabPanel>
      </Card>

      {/* API Key Dialog */}
      <Dialog
        open={showApiDialog}
        onClose={() => setShowApiDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#1a1f2e', border: '1px solid #2a3441' } }}
      >
        <DialogTitle sx={{ color: '#ffffff' }}>Generate New API Key</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="API Key Name"
            placeholder="e.g., Production API"
            sx={{ mt: 2, '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
          />
          <Alert severity="warning" sx={{ mt: 2, backgroundColor: '#ff980020', color: '#ff9800' }}>
            Store your API key securely. It won't be shown again after creation.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApiDialog(false)} sx={{ color: '#b8c5d1' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)' }}
          >
            Generate Key
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#1a1f2e', border: '1px solid #2a3441' } }}
      >
        <DialogTitle sx={{ color: '#ffffff' }}>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: '#b8c5d1' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)} sx={{ color: '#b8c5d1' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)' }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function getNotificationDescription(key: string): string {
  const descriptions: { [key: string]: string } = {
    emailNotifications: 'Receive email notifications for important events',
    workflowSuccess: 'Get notified when workflows complete successfully',
    workflowFailure: 'Get alerted when workflows fail or encounter errors',
    weeklyReports: 'Receive weekly summary reports of your automation activity',
    systemUpdates: 'Be informed about system updates and new features',
    securityAlerts: 'Receive alerts about security-related events'
  };
  return descriptions[key] || '';
}

export default Settings;