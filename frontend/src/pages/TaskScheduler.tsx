import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Psychology as AIIcon,
  Event as EventIcon,
  Repeat as RepeatIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const TaskScheduler: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Daily Data Backup',
      type: 'recurring',
      schedule: 'Daily at 2:00 AM',
      status: 'active',
      nextRun: '2025-09-28 02:00:00',
      lastRun: '2025-09-27 02:00:00'
    },
    {
      id: 2,
      name: 'Weekly Report Generation',
      type: 'recurring',
      schedule: 'Weekly on Monday at 9:00 AM',
      status: 'active',
      nextRun: '2025-09-30 09:00:00',
      lastRun: '2025-09-23 09:00:00'
    },
    {
      id: 3,
      name: 'Customer Follow-up Email',
      type: 'one-time',
      schedule: 'September 28, 2025 at 10:00 AM',
      status: 'scheduled',
      nextRun: '2025-09-28 10:00:00',
      lastRun: null
    }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          ⏰ Task Scheduler
        </Typography>
        <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
          Schedule and automate your tasks with AI-powered optimization
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              backgroundColor: '#1a1f2e', 
              border: '1px solid #00d4ff40',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#00d4ff',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 48, color: '#00d4ff', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                Quick Schedule
              </Typography>
              <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                Schedule a task for immediate or future execution
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              backgroundColor: '#1a1f2e', 
              border: '1px solid #4caf5040',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#4caf50',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <RepeatIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                Recurring Tasks
              </Typography>
              <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                Set up repeating automation workflows
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              backgroundColor: '#1a1f2e', 
              border: '1px solid #9c27b040',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#9c27b0',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AIIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                AI Optimization
              </Typography>
              <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                Let AI suggest optimal scheduling times
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scheduled Tasks */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
          📋 Scheduled Tasks
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: '#00d4ff' }}>
          New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                      {task.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={task.type} 
                        size="small"
                        sx={{ backgroundColor: '#00d4ff20', color: '#00d4ff' }}
                      />
                      <Chip 
                        label={task.status} 
                        size="small"
                        sx={{
                          backgroundColor: task.status === 'active' ? '#4caf5020' :
                                         task.status === 'scheduled' ? '#ff980020' : '#f4433620',
                          color: task.status === 'active' ? '#4caf50' :
                                 task.status === 'scheduled' ? '#ff9800' : '#f44336'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton sx={{ color: task.status === 'active' ? '#ff9800' : '#4caf50' }}>
                      {task.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                    </IconButton>
                    <IconButton sx={{ color: '#00d4ff' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#f44336' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ScheduleIcon sx={{ color: '#b8c5d1', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#b8c5d1' }}>Schedule</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      {task.schedule}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventIcon sx={{ color: '#b8c5d1', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#b8c5d1' }}>Next Run</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      {new Date(task.nextRun).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TimeIcon sx={{ color: '#b8c5d1', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#b8c5d1' }}>Last Run</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      {task.lastRun ? new Date(task.lastRun).toLocaleString() : 'Never'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskScheduler;