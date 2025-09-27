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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Psychology as AIIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EmailAutomation: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [composeDialog, setComposeDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: '',
    tone: 'professional',
    purpose: ''
  });

  const emailTemplates = [
    { id: 1, name: 'Welcome Email', category: 'onboarding', opens: '85%', clicks: '23%' },
    { id: 2, name: 'Newsletter', category: 'marketing', opens: '72%', clicks: '15%' },
    { id: 3, name: 'Follow-up', category: 'sales', opens: '68%', clicks: '31%' },
    { id: 4, name: 'Support Ticket', category: 'support', opens: '95%', clicks: '45%' }
  ];

  const campaigns = [
    { id: 1, name: 'Q4 Product Launch', status: 'active', sent: 1250, opens: 892, clicks: 127 },
    { id: 2, name: 'Customer Survey', status: 'completed', sent: 890, opens: 445, clicks: 89 },
    { id: 3, name: 'Holiday Promotion', status: 'scheduled', sent: 0, opens: 0, clicks: 0 }
  ];

  const handleGenerateAI = async () => {
    // Mock AI generation
    const aiContent = `Subject: ${emailData.purpose} - Personalized Message

Dear Valued Customer,

I hope this message finds you well. I'm reaching out to ${emailData.purpose.toLowerCase()}.

Based on your recent activity and preferences, I thought you might be interested in our latest offerings that align perfectly with your needs.

Key highlights:
• Personalized recommendations based on your usage patterns
• Exclusive benefits tailored to your preferences  
• Priority support and dedicated assistance

I'd love to schedule a brief call to discuss how we can better serve you. Please let me know a convenient time for you.

Best regards,
AI Automation Team

P.S. This email was intelligently crafted using our AI Email Assistant to ensure maximum relevance and engagement.`;

    setEmailData(prev => ({
      ...prev,
      content: aiContent,
      subject: emailData.purpose ? `${emailData.purpose} - Personalized Message` : 'AI Generated Subject'
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          📧 Email Automation
        </Typography>
        <Typography variant="h6" sx={{ color: '#b8c5d1', fontWeight: 400 }}>
          Create, manage, and automate your email campaigns with AI assistance
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': { color: '#b8c5d1' },
            '& .Mui-selected': { color: '#00d4ff' },
            '& .MuiTabs-indicator': { backgroundColor: '#00d4ff' }
          }}
        >
          <Tab label="Compose Email" />
          <Tab label="Templates" />
          <Tab label="Campaigns" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {/* Compose Email */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    ✍️ Compose New Email
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AIIcon />}
                    onClick={handleGenerateAI}
                    sx={{ backgroundColor: '#9c27b0' }}
                  >
                    Generate with AI
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="To"
                    fullWidth
                    value={emailData.to}
                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b8c5d1' },
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#2a3441' },
                        '&:hover fieldset': { borderColor: '#00d4ff' },
                      }
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        label="Subject"
                        fullWidth
                        value={emailData.subject}
                        onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                        sx={{
                          '& .MuiInputLabel-root': { color: '#b8c5d1' },
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': { borderColor: '#2a3441' },
                            '&:hover fieldset': { borderColor: '#00d4ff' },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#b8c5d1' }}>Tone</InputLabel>
                        <Select
                          value={emailData.tone}
                          onChange={(e) => setEmailData({...emailData, tone: e.target.value})}
                          sx={{
                            color: '#ffffff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3441' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00d4ff' },
                          }}
                        >
                          <MenuItem value="professional">Professional</MenuItem>
                          <MenuItem value="friendly">Friendly</MenuItem>
                          <MenuItem value="formal">Formal</MenuItem>
                          <MenuItem value="casual">Casual</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <TextField
                    label="Purpose/Context (for AI generation)"
                    fullWidth
                    value={emailData.purpose}
                    onChange={(e) => setEmailData({...emailData, purpose: e.target.value})}
                    placeholder="e.g., follow up on product demo, introduce new features, schedule meeting"
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b8c5d1' },
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#2a3441' },
                        '&:hover fieldset': { borderColor: '#00d4ff' },
                      }
                    }}
                  />

                  <TextField
                    label="Email Content"
                    multiline
                    rows={12}
                    fullWidth
                    value={emailData.content}
                    onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b8c5d1' },
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#2a3441' },
                        '&:hover fieldset': { borderColor: '#00d4ff' },
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" sx={{ borderColor: '#2a3441', color: '#b8c5d1' }}>
                      Save Draft
                    </Button>
                    <Button variant="outlined" startIcon={<PreviewIcon />} sx={{ borderColor: '#ff9800', color: '#ff9800' }}>
                      Preview
                    </Button>
                    <Button variant="contained" startIcon={<SendIcon />} sx={{ backgroundColor: '#4caf50' }}>
                      Send Now
                    </Button>
                    <Button variant="contained" startIcon={<ScheduleIcon />} sx={{ backgroundColor: '#00d4ff' }}>
                      Schedule
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
                  🎯 Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#b8c5d1' }}>Today's Sent</Typography>
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>247</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#b8c5d1' }}>Open Rate</Typography>
                    <Typography variant="body2" sx={{ color: '#00d4ff', fontWeight: 600 }}>68.3%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#b8c5d1' }}>Click Rate</Typography>
                    <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600 }}>23.1%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
                  💡 AI Suggestions
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><AIIcon sx={{ color: '#9c27b0' }} /></ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ color: '#ffffff' }}>Personalize subject line</Typography>}
                      secondary={<Typography variant="caption" sx={{ color: '#b8c5d1' }}>+15% open rate</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><AIIcon sx={{ color: '#9c27b0' }} /></ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ color: '#ffffff' }}>Add call-to-action</Typography>}
                      secondary={<Typography variant="caption" sx={{ color: '#b8c5d1' }}>+28% click rate</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><AIIcon sx={{ color: '#9c27b0' }} /></ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ color: '#ffffff' }}>Optimize send time</Typography>}
                      secondary={<Typography variant="caption" sx={{ color: '#b8c5d1' }}>Best: 2-4 PM</Typography>}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Templates */}
        <Grid container spacing={3}>
          {emailTemplates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card 
                sx={{ 
                  backgroundColor: '#1a1f2e', 
                  border: '1px solid #2a3441',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#00d4ff',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                      {template.name}
                    </Typography>
                    <Chip 
                      label={template.category} 
                      size="small" 
                      sx={{ backgroundColor: '#00d4ff20', color: '#00d4ff' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                        {template.opens}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b8c5d1' }}>
                        Open Rate
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 700 }}>
                        {template.clicks}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b8c5d1' }}>
                        Click Rate
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} sx={{ borderColor: '#00d4ff', color: '#00d4ff' }}>
                      Use
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<PreviewIcon />} sx={{ borderColor: '#ff9800', color: '#ff9800' }}>
                      Preview
                    </Button>
                    <IconButton size="small" sx={{ color: '#f44336' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Campaigns */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
              📈 Email Campaigns
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: '#00d4ff' }}>
              New Campaign
            </Button>
          </Box>

          <Grid container spacing={3}>
            {campaigns.map((campaign) => (
              <Grid item xs={12} key={campaign.id}>
                <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                          {campaign.name}
                        </Typography>
                        <Chip 
                          label={campaign.status} 
                          size="small"
                          sx={{
                            backgroundColor: campaign.status === 'active' ? '#4caf5020' :
                                           campaign.status === 'completed' ? '#00d4ff20' : '#ff980020',
                            color: campaign.status === 'active' ? '#4caf50' :
                                   campaign.status === 'completed' ? '#00d4ff' : '#ff9800'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton sx={{ color: '#00d4ff' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton sx={{ color: '#f44336' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={3}>
                        <Typography variant="h5" sx={{ color: '#00d4ff', fontWeight: 700 }}>
                          {campaign.sent.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                          Sent
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                          {campaign.opens.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                          Opens ({campaign.sent > 0 ? ((campaign.opens / campaign.sent) * 100).toFixed(1) : '0'}%)
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700 }}>
                          {campaign.clicks.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                          Clicks ({campaign.sent > 0 ? ((campaign.clicks / campaign.sent) * 100).toFixed(1) : '0'}%)
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                          {campaign.opens > 0 ? ((campaign.clicks / campaign.opens) * 100).toFixed(1) : '0'}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                          CTR
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Analytics */}
        <Box>
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 3 }}>
            📊 Email Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: '#b8c5d1' }}>
            Detailed analytics and reporting will be implemented here, including:
            • Campaign performance metrics
            • A/B testing results
            • Audience engagement insights
            • Deliverability analytics
            • Revenue attribution
          </Typography>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default EmailAutomation;