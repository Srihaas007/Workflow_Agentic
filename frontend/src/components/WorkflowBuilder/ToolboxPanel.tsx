import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';

interface WorkflowComponent {
  id: string;
  type: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface ToolboxPanelProps {
  components: WorkflowComponent[];
}

export const ToolboxPanel: React.FC<ToolboxPanelProps> = ({ components }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: '#1a1f2e',
        borderRight: '1px solid #2a3441',
        height: '100%',
        overflow: 'auto'
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
          🧰 Components
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#b8c5d1', mb: 3 }}>
          Drag and drop components to build your workflow
        </Typography>

        <List sx={{ p: 0 }}>
          {components.map((component) => (
            <Tooltip key={component.id} title={component.description} placement="right">
              <ListItem
                draggable
                onDragStart={(e) => onDragStart(e, component.id)}
                sx={{
                  cursor: 'grab',
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: '#0a0e1a',
                  border: '1px solid #2a3441',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: `${component.color}10`,
                    borderColor: component.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${component.color}20`
                  },
                  '&:active': {
                    cursor: 'grabbing'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: component.color
                  }}
                >
                  {component.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 500
                      }}
                    >
                      {component.type}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#b8c5d1',
                        fontSize: '0.75rem'
                      }}
                    >
                      {component.description}
                    </Typography>
                  }
                />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* Quick Help */}
      <Card
        sx={{
          m: 2,
          mt: 'auto',
          backgroundColor: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.2)'
        }}
      >
        <CardContent sx={{ py: 2 }}>
          <Typography variant="caption" sx={{ color: '#00d4ff', fontWeight: 600 }}>
            💡 Quick Tips
          </Typography>
          <Typography variant="caption" sx={{ color: '#b8c5d1', display: 'block', mt: 1 }}>
            • Drag components to the canvas
            • Click nodes to configure them
            • Connect nodes by dragging from output to input
            • Use AI suggestions for optimization
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};