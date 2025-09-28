import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Psychology as AIIcon,
  TrendingUp as AnalyticsIcon,
  LightbulbOutlined as IdeaIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Speed as OptimizeIcon,
  Security as SecurityIcon,
  MonetizationOn as CostIcon,
  Timeline as PerformanceIcon,
  AutoFixHigh as AutoFixIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';

interface Recommendation {
  id: string;
  type: 'optimization' | 'security' | 'cost' | 'performance' | 'best-practice';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  workflow: string;
  estimatedSavings?: string;
  implementationTime?: string;
  priority: number;
}

interface Insight {
  id: string;
  category: 'performance' | 'usage' | 'trends' | 'issues';
  title: string;
  description: string;
  metric: string;
  trend: 'up' | 'down' | 'stable';
  severity?: 'info' | 'warning' | 'error';
}

const WorkflowAdvisor: React.FC = () => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'optimization',
      title: 'Optimize Email Campaign Workflow',
      description: 'Your email campaign workflow has unnecessary delays. Consider parallelizing email validation and template rendering.',
      impact: 'high',
      effort: 'medium',
      workflow: 'Email Marketing Campaign',
      estimatedSavings: '45% execution time',
      implementationTime: '2-3 hours',
      priority: 1
    },
    {
      id: '2',
      type: 'cost',
      title: 'Reduce API Calls in Data Sync',
      description: 'Batch multiple API calls together to reduce costs and improve performance.',
      impact: 'medium',
      effort: 'low',
      workflow: 'Customer Data Sync',
      estimatedSavings: '$120/month',
      implementationTime: '1 hour',
      priority: 2
    },
    {
      id: '3',
      type: 'security',
      title: 'Add Rate Limiting to Payment Workflow',
      description: 'Implement rate limiting to prevent abuse and ensure secure payment processing.',
      impact: 'high',
      effort: 'medium',
      workflow: 'Payment Processing',
      implementationTime: '3-4 hours',
      priority: 1
    },
    {
      id: '4',
      type: 'performance',
      title: 'Cache Frequently Used Templates',
      description: 'Cache email templates to reduce database queries and improve response time.',
      impact: 'medium',
      effort: 'low',
      workflow: 'Report Generation',
      estimatedSavings: '30% faster execution',
      implementationTime: '1-2 hours',
      priority: 3
    },
    {
      id: '5',
      type: 'best-practice',
      title: 'Implement Proper Error Handling',
      description: 'Add comprehensive error handling and retry logic to improve workflow reliability.',
      impact: 'high',
      effort: 'high',
      workflow: 'Invoice Generation',
      implementationTime: '4-6 hours',
      priority: 2
    }
  ];

  const insights: Insight[] = [
    {
      id: '1',
      category: 'performance',
      title: 'Average Execution Time Improved',
      description: 'Your workflows are running 23% faster this week compared to last week.',
      metric: '+23%',
      trend: 'up'
    },
    {
      id: '2',
      category: 'usage',
      title: 'Peak Usage Hours Identified',
      description: 'Most workflows run between 9-11 AM. Consider load balancing.',
      metric: '9-11 AM',
      trend: 'stable',
      severity: 'info'
    },
    {
      id: '3',
      category: 'issues',
      title: 'Error Rate Increasing',
      description: 'Payment workflow error rate increased by 15% this week.',
      metric: '+15%',
      trend: 'up',
      severity: 'warning'
    },
    {
      id: '4',
      category: 'trends',
      title: 'API Usage Growing',
      description: 'External API calls have doubled this month, consider optimization.',
      metric: '+100%',
      trend: 'up',
      severity: 'info'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <OptimizeIcon sx={{ color: '#00d4ff' }} />;
      case 'security':
        return <SecurityIcon sx={{ color: '#f44336' }} />;
      case 'cost':
        return <CostIcon sx={{ color: '#4caf50' }} />;
      case 'performance':
        return <PerformanceIcon sx={{ color: '#ff9800' }} />;
      case 'best-practice':
        return <IdeaIcon sx={{ color: '#9c27b0' }} />;
      default:
        return <AIIcon />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === filter);

  const aiStats = [
    { label: 'Active Monitoring', value: '24/7', icon: <AIIcon />, color: '#00d4ff' },
    { label: 'Recommendations Generated', value: '47', icon: <IdeaIcon />, color: '#9c27b0' },
    { label: 'Issues Prevented', value: '12', icon: <SecurityIcon />, color: '#4caf50' },
    { label: 'Avg Improvement', value: '28%', icon: <OptimizeIcon />, color: '#ff9800' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          🧠 Workflow Advisor
        </Typography>
        <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
          Get AI-powered insights and recommendations for your workflows
        </Typography>
      </Box>

      {/* AI Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {aiStats.map((stat, index) => (
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
        {/* AI Insights */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 3, display: 'flex', alignItems: 'center' }}>
                <AnalyticsIcon sx={{ mr: 1, color: '#00d4ff' }} />
                AI Insights
              </Typography>
              <List>
                {insights.map((insight, index) => (
                  <React.Fragment key={insight.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                            {insight.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#b8c5d1' }}>
                              {insight.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip
                                label={insight.metric}
                                size="small"
                                sx={{
                                  backgroundColor: insight.trend === 'up' ? '#4caf5020' : '#ff980020',
                                  color: insight.trend === 'up' ? '#4caf50' : '#ff9800',
                                  mr: 1
                                }}
                              />
                              {insight.severity && (
                                <Chip
                                  label={insight.severity}
                                  size="small"
                                  color={insight.severity === 'warning' ? 'warning' : 'info'}
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < insights.length - 1 && <Divider sx={{ backgroundColor: '#2a3441' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                  <IdeaIcon sx={{ mr: 1, color: '#9c27b0' }} />
                  AI Recommendations
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['all', 'optimization', 'security', 'cost', 'performance', 'best-practice'].map((type) => (
                    <Chip
                      key={type}
                      label={type === 'all' ? 'All' : type.replace('-', ' ')}
                      onClick={() => setFilter(type)}
                      variant={filter === type ? 'filled' : 'outlined'}
                      size="small"
                      sx={{
                        textTransform: 'capitalize',
                        ...(filter === type && {
                          backgroundColor: '#00d4ff20',
                          color: '#00d4ff',
                          borderColor: '#00d4ff'
                        })
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <List>
                {filteredRecommendations
                  .sort((a, b) => a.priority - b.priority)
                  .map((recommendation, index) => (
                    <React.Fragment key={recommendation.id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemIcon>
                          {getTypeIcon(recommendation.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                                {recommendation.title}
                              </Typography>
                              <Chip
                                label={`Priority ${recommendation.priority}`}
                                size="small"
                                color={recommendation.priority === 1 ? 'error' : recommendation.priority === 2 ? 'warning' : 'default'}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#b8c5d1', mb: 2 }}>
                                {recommendation.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  label={`Impact: ${recommendation.impact}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: getImpactColor(recommendation.impact) + '20',
                                    color: getImpactColor(recommendation.impact),
                                    border: `1px solid ${getImpactColor(recommendation.impact)}`
                                  }}
                                />
                                <Chip
                                  label={`Effort: ${recommendation.effort}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: getEffortColor(recommendation.effort) + '20',
                                    color: getEffortColor(recommendation.effort),
                                    border: `1px solid ${getEffortColor(recommendation.effort)}`
                                  }}
                                />
                                {recommendation.estimatedSavings && (
                                  <Chip
                                    label={recommendation.estimatedSavings}
                                    size="small"
                                    sx={{ backgroundColor: '#4caf5020', color: '#4caf50' }}
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" sx={{ color: '#757575' }}>
                                Workflow: {recommendation.workflow}
                                {recommendation.implementationTime && ` • Est. time: ${recommendation.implementationTime}`}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => setSelectedRecommendation(recommendation)}
                            sx={{ borderColor: '#00d4ff', color: '#00d4ff' }}
                          >
                            View Details
                          </Button>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" sx={{ color: '#4caf50' }}>
                              <ThumbUpIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#f44336' }}>
                              <ThumbDownIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < filteredRecommendations.length - 1 && 
                        <Divider sx={{ backgroundColor: '#2a3441' }} />
                      }
                    </React.Fragment>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendation Details Dialog */}
      <Dialog
        open={!!selectedRecommendation}
        onClose={() => setSelectedRecommendation(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1f2e',
            border: '1px solid #2a3441'
          }
        }}
      >
        {selectedRecommendation && (
          <>
            <DialogTitle sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
              {getTypeIcon(selectedRecommendation.type)}
              <Box sx={{ ml: 1 }}>
                {selectedRecommendation.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#b8c5d1', mb: 2 }}>
                  {selectedRecommendation.description}
                </Typography>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                  Implementation Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Affected Workflow"
                      secondary={selectedRecommendation.workflow}
                      sx={{
                        '& .MuiListItemText-primary': { color: '#b8c5d1' },
                        '& .MuiListItemText-secondary': { color: '#ffffff' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Expected Impact"
                      secondary={`${selectedRecommendation.impact} impact`}
                      sx={{
                        '& .MuiListItemText-primary': { color: '#b8c5d1' },
                        '& .MuiListItemText-secondary': { color: getImpactColor(selectedRecommendation.impact) }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Implementation Effort"
                      secondary={`${selectedRecommendation.effort} effort required`}
                      sx={{
                        '& .MuiListItemText-primary': { color: '#b8c5d1' },
                        '& .MuiListItemText-secondary': { color: getEffortColor(selectedRecommendation.effort) }
                      }}
                    />
                  </ListItem>
                  {selectedRecommendation.estimatedSavings && (
                    <ListItem>
                      <ListItemText
                        primary="Estimated Savings"
                        secondary={selectedRecommendation.estimatedSavings}
                        sx={{
                          '& .MuiListItemText-primary': { color: '#b8c5d1' },
                          '& .MuiListItemText-secondary': { color: '#4caf50' }
                        }}
                      />
                    </ListItem>
                  )}
                  {selectedRecommendation.implementationTime && (
                    <ListItem>
                      <ListItemText
                        primary="Implementation Time"
                        secondary={selectedRecommendation.implementationTime}
                        sx={{
                          '& .MuiListItemText-primary': { color: '#b8c5d1' },
                          '& .MuiListItemText-secondary': { color: '#ffffff' }
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setSelectedRecommendation(null)}
                sx={{ color: '#b8c5d1' }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<AutoFixIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 100%)'
                }}
              >
                Implement
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WorkflowAdvisor;