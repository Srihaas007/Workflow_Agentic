import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  BarChart as ChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as TimeIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const metrics = [
    {
      title: 'Total Workflows Executed',
      value: '2,847',
      change: '+15.3%',
      trend: 'up',
      icon: <ChartIcon />,
      color: '#00d4ff'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <SuccessIcon />,
      color: '#4caf50'
    },
    {
      title: 'Average Execution Time',
      value: '3.2s',
      change: '-0.8s',
      trend: 'up',
      icon: <SpeedIcon />,
      color: '#ff9800'
    },
    {
      title: 'Failed Workflows',
      value: '164',
      change: '-12.5%',
      trend: 'up',
      icon: <ErrorIcon />,
      color: '#f44336'
    }
  ];

  const topWorkflows = [
    { name: 'Customer Onboarding', executions: 245, success: 98.4, avgTime: '2.1s' },
    { name: 'Email Campaign Automation', executions: 189, success: 92.1, avgTime: '4.3s' },
    { name: 'Data Backup Process', executions: 156, success: 99.2, avgTime: '15.7s' },
    { name: 'Invoice Generation', executions: 134, success: 96.3, avgTime: '1.8s' },
    { name: 'Report Scheduling', executions: 98, success: 88.7, avgTime: '8.2s' }
  ];

  const recentErrors = [
    {
      workflow: 'Payment Processing',
      error: 'API timeout',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      workflow: 'Email Verification',
      error: 'Invalid email format',
      time: '4 hours ago',
      severity: 'medium'
    },
    {
      workflow: 'Data Sync',
      error: 'Connection refused',
      time: '6 hours ago',
      severity: 'low'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
            📊 Analytics & Insights
          </Typography>
          <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
            Track performance and gain insights into your automation workflows
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: '#b8c5d1' }}>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ color: '#ffffff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#2a3441' } }}
          >
            <MenuItem value="24hours">Last 24 Hours</MenuItem>
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              backgroundColor: '#1a1f2e', 
              border: '1px solid #2a3441',
              background: `linear-gradient(135deg, ${metric.color}15 0%, #1a1f2e 100%)`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: metric.color, mr: 1 }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                    {metric.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {metric.trend === 'up' ? 
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} /> :
                    <TrendingDownIcon sx={{ color: '#f44336', fontSize: '1rem', mr: 0.5 }} />
                  }
                  <Typography variant="body2" sx={{ color: metric.trend === 'up' ? '#4caf50' : '#f44336' }}>
                    {metric.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Top Performing Workflows */}
        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 3, display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1, color: '#00d4ff' }} />
                Top Performing Workflows
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#b8c5d1', borderColor: '#2a3441' }}>Workflow</TableCell>
                      <TableCell sx={{ color: '#b8c5d1', borderColor: '#2a3441' }}>Executions</TableCell>
                      <TableCell sx={{ color: '#b8c5d1', borderColor: '#2a3441' }}>Success Rate</TableCell>
                      <TableCell sx={{ color: '#b8c5d1', borderColor: '#2a3441' }}>Avg Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topWorkflows.map((workflow, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#2a3441' }}>
                          {workflow.name}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#2a3441' }}>
                          {workflow.executions}
                        </TableCell>
                        <TableCell sx={{ borderColor: '#2a3441' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={workflow.success}
                              sx={{ 
                                width: 60, 
                                mr: 1,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: workflow.success > 95 ? '#4caf50' : workflow.success > 90 ? '#ff9800' : '#f44336'
                                }
                              }}
                            />
                            <Typography variant="body2" sx={{ color: '#ffffff', minWidth: 40 }}>
                              {workflow.success}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#2a3441' }}>
                          {workflow.avgTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Errors */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 3, display: 'flex', alignItems: 'center' }}>
                <ErrorIcon sx={{ mr: 1, color: '#f44336' }} />
                Recent Errors
              </Typography>
              <List>
                {recentErrors.map((error, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <ErrorIcon sx={{ 
                          color: error.severity === 'high' ? '#f44336' : 
                                error.severity === 'medium' ? '#ff9800' : '#ffeb3b'
                        }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: '#ffffff' }}>
                            {error.workflow}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: '#f44336' }}>
                              {error.error}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#b8c5d1', display: 'block' }}>
                              {error.time}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        size="small"
                        label={error.severity}
                        color={error.severity === 'high' ? 'error' : error.severity === 'medium' ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    </ListItem>
                    {index < recentErrors.length - 1 && <Divider sx={{ backgroundColor: '#2a3441' }} />}
                  </React.Fragment>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  mt: 2,
                  borderColor: '#2a3441',
                  color: '#00d4ff',
                  '&:hover': { borderColor: '#00d4ff' }
                }}
              >
                View All Errors
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;