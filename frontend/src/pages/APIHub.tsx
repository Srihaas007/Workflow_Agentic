import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { Hub as HubIcon, Add as AddIcon } from '@mui/icons-material';

const APIHub: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          🔗 API Integration Hub
        </Typography>
        <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
          Connect and manage all your API integrations in one place
        </Typography>
      </Box>
      
      <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', mb: 2 }}>
            🚧 Coming Soon
          </Typography>
          <Typography variant="body1" sx={{ color: '#b8c5d1', textAlign: 'center' }}>
            API Integration Hub will provide seamless connectivity with popular services like:
            • Google Workspace • Slack • Microsoft 365 • Salesforce • Zapier • And many more!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default APIHub;