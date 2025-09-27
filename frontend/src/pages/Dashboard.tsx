import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Psychology as AIIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Active Workflows', value: 12, change: '+3', color: '#00d4ff' },
    { title: 'Emails Sent Today', value: 247, change: '+15%', color: '#4caf50' },
    { title: 'Scheduled Tasks', value: 38, change: '+2', color: '#ff9800' },
    { title: 'API Calls', value: 1542, change: '+22%', color: '#9c27b0' }
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'workflow', 
      title: 'Customer Onboarding', 
      status: 'completed', 
      time: '2 minutes ago',
      icon: <CheckIcon />
    },
    { 
      id: 2, 
      type: 'email', 
      title: 'Weekly Newsletter', 
      status: 'running', 
      time: '5 minutes ago',
      icon: <PendingIcon />
    },
    { 
      id: 3, 
      type: 'schedule', 
      title: 'Data Backup', 
      status: 'failed', 
      time: '10 minutes ago',
      icon: <ErrorIcon />
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          🎯 Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
          Welcome to your AI-Powered Automation Platform
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: '#1a1f2e',
                border: `1px solid ${stat.color}40`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}20`
                }
              }}
            >
              <CardContent>
                <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 2 }}>
                  {stat.title}
                </Typography>
                <Chip
                  label={stat.change}
                  size="small"
                  sx={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                    fontWeight: 600
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441', height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 3 }}>
                🚀 Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={() => navigate('/workflow-builder')}
                  sx={{
                    backgroundColor: '#00d4ff',
                    '&:hover': { backgroundColor: '#0099cc' }
                  }}
                >
                  Create New Workflow
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={() => navigate('/email-automation')}
                  sx={{ borderColor: '#ff6b35', color: '#ff6b35' }}
                >
                  Send Email Campaign
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => navigate('/task-scheduler')}
                  sx={{ borderColor: '#4caf50', color: '#4caf50' }}
                >
                  Schedule Task
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AIIcon />}
                  onClick={() => navigate('/workflow-advisor')}
                  sx={{ borderColor: '#9c27b0', color: '#9c27b0' }}
                >
                  Get AI Suggestions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 3 }}>
                📊 Recent Activity
              </Typography>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ 
                        color: activity.status === 'completed' ? '#4caf50' :
                               activity.status === 'running' ? '#ff9800' : '#f44336'
                      }}>
                        {activity.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: '#b8c5d1' }}>
                            {activity.time}
                          </Typography>
                        }
                      />
                      <Chip
                        label={activity.status}
                        size="small"
                        sx={{
                          backgroundColor: activity.status === 'completed' ? '#4caf5020' :
                                         activity.status === 'running' ? '#ff980020' : '#f4433620',
                          color: activity.status === 'completed' ? '#4caf50' :
                                 activity.status === 'running' ? '#ff9800' : '#f44336'
                        }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider sx={{ borderColor: '#2a3441' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 3 }}>
                ⚡ System Status
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    AI Services
                  </Typography>
                  <Chip label="Active" size="small" sx={{ backgroundColor: '#4caf5020', color: '#4caf50' }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={95} 
                  sx={{ 
                    backgroundColor: '#2a3441',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
                  }} 
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    Database
                  </Typography>
                  <Chip label="Healthy" size="small" sx={{ backgroundColor: '#00d4ff20', color: '#00d4ff' }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={87} 
                  sx={{ 
                    backgroundColor: '#2a3441',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#00d4ff' }
                  }} 
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    API Performance
                  </Typography>
                  <Chip label="Optimal" size="small" sx={{ backgroundColor: '#ff980020', color: '#ff9800' }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={92} 
                  sx={{ 
                    backgroundColor: '#2a3441',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;