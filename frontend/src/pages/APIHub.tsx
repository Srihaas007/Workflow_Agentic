import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Divider,
  Paper,
  Badge
} from '@mui/material';
import {
  Hub as HubIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as ConnectedIcon,
  Error as DisconnectedIcon,
  Api as ApiIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  lastUsed: string;
  requests: number;
  icon: string;
  color: string;
}

const APIHub: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    apiUrl: '',
    apiKey: '',
    category: 'productivity'
  });

  const integrations: ApiIntegration[] = [
    {
      id: '1',
      name: 'Google Workspace',
      description: 'Gmail, Sheets, Drive, Calendar integration',
      category: 'productivity',
      status: 'connected',
      lastUsed: '2 minutes ago',
      requests: 1247,
      icon: '🔗',
      color: '#4285f4'
    },
    {
      id: '2',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'communication',
      status: 'connected',
      lastUsed: '15 minutes ago',
      requests: 856,
      icon: '💬',
      color: '#4a154b'
    },
    {
      id: '3',
      name: 'Salesforce',
      description: 'CRM data synchronization',
      category: 'crm',
      status: 'disconnected',
      lastUsed: '2 hours ago',
      requests: 234,
      icon: '☁️',
      color: '#00a1e0'
    },
    {
      id: '4',
      name: 'Stripe',
      description: 'Payment processing and webhooks',
      category: 'payments',
      status: 'connected',
      lastUsed: '1 hour ago',
      requests: 567,
      icon: '💳',
      color: '#635bff'
    },
    {
      id: '5',
      name: 'Twilio',
      description: 'SMS and voice communications',
      category: 'communication',
      status: 'error',
      lastUsed: '3 hours ago',
      requests: 123,
      icon: '📱',
      color: '#f22f46'
    },
    {
      id: '6',
      name: 'Microsoft 365',
      description: 'Office apps and Azure services',
      category: 'productivity',
      status: 'connected',
      lastUsed: '30 minutes ago',
      requests: 789,
      icon: '🏢',
      color: '#0078d4'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', count: integrations.length },
    { value: 'productivity', label: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length },
    { value: 'communication', label: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
    { value: 'crm', label: 'CRM', count: integrations.filter(i => i.category === 'crm').length },
    { value: 'payments', label: 'Payments', count: integrations.filter(i => i.category === 'payments').length }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <ConnectedIcon sx={{ color: '#4caf50' }} />;
      case 'disconnected':
        return <DisconnectedIcon sx={{ color: '#757575' }} />;
      case 'error':
        return <DisconnectedIcon sx={{ color: '#f44336' }} />;
      default:
        return <ApiIcon />;
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      connected: { label: 'Connected', color: 'success' as const },
      disconnected: { label: 'Disconnected', color: 'default' as const },
      error: { label: 'Error', color: 'error' as const }
    };
    
    return (
      <Chip
        label={statusConfig[status as keyof typeof statusConfig].label}
        color={statusConfig[status as keyof typeof statusConfig].color}
        size="small"
        variant="outlined"
      />
    );
  };

  const handleAddIntegration = () => {
    // Add integration logic here
    console.log('Adding integration:', newIntegration);
    setOpenDialog(false);
    setNewIntegration({ name: '', apiUrl: '', apiKey: '', category: 'productivity' });
  };

  const stats = [
    { label: 'Total Integrations', value: integrations.length, icon: <HubIcon />, color: '#00d4ff' },
    { label: 'Active Connections', value: integrations.filter(i => i.status === 'connected').length, icon: <ConnectedIcon />, color: '#4caf50' },
    { label: 'API Calls Today', value: '12.4k', icon: <SpeedIcon />, color: '#ff9800' },
    { label: 'Uptime', value: '99.9%', icon: <SecurityIcon />, color: '#9c27b0' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
            🔗 API Integration Hub
          </Typography>
          <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
            Connect and manage all your API integrations in one place
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)',
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          Add Integration
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              backgroundColor: '#1a1f2e', 
              border: '1px solid #2a3441',
              background: `linear-gradient(135deg, ${stat.color}15 0%, #1a1f2e 100%)`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: stat.color, mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Category Filter */}
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Categories
              </Typography>
              <List>
                {categories.map((category) => (
                  <ListItem
                    key={category.value}
                    button
                    selected={selectedCategory === category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: '#00d4ff20',
                        '&:hover': { backgroundColor: '#00d4ff30' }
                      }
                    }}
                  >
                    <ListItemText
                      primary={category.label}
                      sx={{ '& .MuiListItemText-primary': { color: '#ffffff' } }}
                    />
                    <Badge badgeContent={category.count} color="primary" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Integrations List */}
        <Grid item xs={12} md={9}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>
                API Integrations
              </Typography>
              <List>
                {filteredIntegrations.map((integration, index) => (
                  <React.Fragment key={integration.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            backgroundColor: integration.color + '20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                          }}
                        >
                          {integration.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ color: '#ffffff' }}>
                              {integration.name}
                            </Typography>
                            {getStatusChip(integration.status)}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#b8c5d1', mb: 0.5 }}>
                              {integration.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Typography variant="caption" sx={{ color: '#757575' }}>
                                Last used: {integration.lastUsed}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#757575' }}>
                                Requests: {integration.requests.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            sx={{ color: '#b8c5d1' }}
                          >
                            <SettingsIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#b8c5d1' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredIntegrations.length - 1 && 
                      <Divider sx={{ backgroundColor: '#2a3441' }} />
                    }
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Integration Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1f2e',
            border: '1px solid #2a3441'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff' }}>
          Add New API Integration
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Integration Name"
              value={newIntegration.name}
              onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
              fullWidth
              sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
            />
            <TextField
              label="API URL"
              value={newIntegration.apiUrl}
              onChange={(e) => setNewIntegration({ ...newIntegration, apiUrl: e.target.value })}
              fullWidth
              sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
            />
            <TextField
              label="API Key"
              type="password"
              value={newIntegration.apiKey}
              onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
              fullWidth
              sx={{ '& .MuiInputLabel-root': { color: '#b8c5d1' } }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b8c5d1' }}>Category</InputLabel>
              <Select
                value={newIntegration.category}
                onChange={(e) => setNewIntegration({ ...newIntegration, category: e.target.value })}
                sx={{ color: '#ffffff' }}
              >
                <MenuItem value="productivity">Productivity</MenuItem>
                <MenuItem value="communication">Communication</MenuItem>
                <MenuItem value="crm">CRM</MenuItem>
                <MenuItem value="payments">Payments</MenuItem>
                <MenuItem value="analytics">Analytics</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#b8c5d1' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddIntegration}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)'
            }}
          >
            Add Integration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default APIHub;