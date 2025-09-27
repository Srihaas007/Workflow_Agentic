import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface PropertiesPanelProps {
  node: any;
  onClose: () => void;
  onUpdate: (node: any) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  node,
  onClose,
  onUpdate
}) => {
  const [nodeData, setNodeData] = useState(node.data);
  const [nodeName, setNodeName] = useState(node.data.label || '');

  const handleSave = () => {
    const updatedNode = {
      ...node,
      data: {
        ...nodeData,
        label: nodeName
      }
    };
    onUpdate(updatedNode);
    onClose();
  };

  const renderProperties = () => {
    switch (nodeData.type) {
      case 'email':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="To Email"
              fullWidth
              defaultValue={nodeData.toEmail || ''}
              onChange={(e) => setNodeData({...nodeData, toEmail: e.target.value})}
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
              label="Subject"
              fullWidth
              defaultValue={nodeData.subject || ''}
              onChange={(e) => setNodeData({...nodeData, subject: e.target.value})}
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
              label="Message"
              multiline
              rows={4}
              fullWidth
              defaultValue={nodeData.message || ''}
              onChange={(e) => setNodeData({...nodeData, message: e.target.value})}
              sx={{
                '& .MuiInputLabel-root': { color: '#b8c5d1' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#2a3441' },
                  '&:hover fieldset': { borderColor: '#00d4ff' },
                }
              }}
            />
          </Box>
        );
      
      case 'schedule':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b8c5d1' }}>Schedule Type</InputLabel>
              <Select
                defaultValue={nodeData.scheduleType || 'once'}
                onChange={(e) => setNodeData({...nodeData, scheduleType: e.target.value})}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3441' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00d4ff' },
                }}
              >
                <MenuItem value="once">Run Once</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date/Time"
              type="datetime-local"
              fullWidth
              defaultValue={nodeData.datetime || ''}
              onChange={(e) => setNodeData({...nodeData, datetime: e.target.value})}
              sx={{
                '& .MuiInputLabel-root': { color: '#b8c5d1' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#2a3441' },
                  '&:hover fieldset': { borderColor: '#00d4ff' },
                }
              }}
            />
          </Box>
        );

      case 'api':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b8c5d1' }}>HTTP Method</InputLabel>
              <Select
                defaultValue={nodeData.method || 'GET'}
                onChange={(e) => setNodeData({...nodeData, method: e.target.value})}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3441' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00d4ff' },
                }}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="API Endpoint URL"
              fullWidth
              defaultValue={nodeData.url || ''}
              onChange={(e) => setNodeData({...nodeData, url: e.target.value})}
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
              label="Headers (JSON)"
              multiline
              rows={3}
              fullWidth
              defaultValue={nodeData.headers || '{}'}
              onChange={(e) => setNodeData({...nodeData, headers: e.target.value})}
              sx={{
                '& .MuiInputLabel-root': { color: '#b8c5d1' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#2a3441' },
                  '&:hover fieldset': { borderColor: '#00d4ff' },
                }
              }}
            />
          </Box>
        );

      case 'code':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b8c5d1' }}>Language</InputLabel>
              <Select
                defaultValue={nodeData.language || 'javascript'}
                onChange={(e) => setNodeData({...nodeData, language: e.target.value})}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3441' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00d4ff' },
                }}
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="bash">Bash</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Code"
              multiline
              rows={8}
              fullWidth
              defaultValue={nodeData.code || '// Your code here'}
              onChange={(e) => setNodeData({...nodeData, code: e.target.value})}
              sx={{
                '& .MuiInputLabel-root': { color: '#b8c5d1' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  '& fieldset': { borderColor: '#2a3441' },
                  '&:hover fieldset': { borderColor: '#00d4ff' },
                }
              }}
            />
          </Box>
        );

      default:
        return (
          <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
            Select properties specific to this node type
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        width: 350,
        backgroundColor: '#1a1f2e',
        borderLeft: '1px solid #2a3441',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#0a0e1a',
          borderBottom: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon sx={{ color: '#00d4ff' }} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
            Properties
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#b8c5d1' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {/* Node Info */}
        <Card sx={{ mb: 3, backgroundColor: '#0a0e1a', border: '1px solid #2a3441' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: `${nodeData.color || '#00d4ff'}20`,
                  color: nodeData.color || '#00d4ff'
                }}
              >
                {nodeData.icon}
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  {nodeData.type}
                </Typography>
                <Chip
                  label={`ID: ${node.id}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(184, 197, 209, 0.1)',
                    color: '#b8c5d1',
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Node Name */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Node Name"
            fullWidth
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: '#b8c5d1' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#2a3441' },
                '&:hover fieldset': { borderColor: '#00d4ff' },
              }
            }}
          />
        </Box>

        <Divider sx={{ borderColor: '#2a3441', mb: 3 }} />

        {/* Type-specific Properties */}
        <Typography variant="subtitle2" sx={{ color: '#00d4ff', mb: 2, fontWeight: 600 }}>
          Configuration
        </Typography>
        
        {renderProperties()}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#0a0e1a',
          borderTop: '1px solid #2a3441',
          display: 'flex',
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#2a3441',
            color: '#b8c5d1',
            flex: 1
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: '#00d4ff',
            flex: 1
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};