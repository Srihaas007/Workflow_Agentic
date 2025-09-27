import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Card } from '@mui/material';

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
    icon: React.ReactNode;
    description: string;
    color?: string;
  };
  selected: boolean;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const nodeColor = data.color || '#00d4ff';

  return (
    <Box sx={{ position: 'relative' }}>
      <Handle 
        type="target" 
        position={Position.Top}
        style={{
          background: nodeColor,
          borderColor: nodeColor,
          width: 12,
          height: 12
        }}
      />
      
      <Card
        sx={{
          minWidth: 180,
          backgroundColor: selected ? 'rgba(0, 212, 255, 0.1)' : '#1a1f2e',
          border: `2px solid ${selected ? nodeColor : '#2a3441'}`,
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: nodeColor,
            boxShadow: `0 0 20px ${nodeColor}20`
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: `${nodeColor}20`,
              color: nodeColor
            }}
          >
            {data.icon}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {data.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#b8c5d1',
                fontSize: '0.75rem'
              }}
            >
              {data.description}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: nodeColor,
          borderColor: nodeColor,
          width: 12,
          height: 12
        }}
      />
    </Box>
  );
};