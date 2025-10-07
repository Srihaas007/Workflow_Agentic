import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Psychology as AIIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Hub as HubIcon,
  Code as CodeIcon,
  DataObject as DataIcon,
  AccountTree as FlowIcon,
  MoreVert as MoreIcon,
  OpenInNew as NodeRedIcon
} from '@mui/icons-material';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { saveWorkflow, publishWorkflow } from '../api/workflows';

// Custom Node Components
import { CustomNode } from '../components/WorkflowBuilder/CustomNode';
import { ToolboxPanel } from '../components/WorkflowBuilder/ToolboxPanel';
import { PropertiesPanel } from '../components/WorkflowBuilder/PropertiesPanel';

// Node types for the workflow
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes for the workflow
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: {
      label: 'Start',
      type: 'start',
      icon: <PlayIcon />,
      description: 'Workflow starting point'
    },
  },
];

const initialEdges: Edge[] = [];

// Available workflow components
const workflowComponents = [
  {
    id: 'nodered',
    type: 'Node-RED Flow',
    icon: <FlowIcon />,
    color: '#ff6b35',
    description: 'Advanced visual flow programming'
  },
  {
    id: 'email',
    type: 'Email Action',
    icon: <EmailIcon />,
    color: '#ff6b35',
    description: 'Send automated emails'
  },
  {
    id: 'schedule',
    type: 'Schedule Task',
    icon: <ScheduleIcon />,
    color: '#8b5cf6',
    description: 'Schedule tasks and reminders'
  },
  {
    id: 'api',
    type: 'API Call',
    icon: <HubIcon />,
    color: '#4caf50',
    description: 'Make HTTP API requests'
  },
  {
    id: 'code',
    type: 'Code Block',
    icon: <CodeIcon />,
    color: '#9c27b0',
    description: 'Execute custom code'
  },
  {
    id: 'data',
    type: 'Data Transform',
    icon: <DataIcon />,
    color: '#ff9800',
    description: 'Transform and process data'
  },
  {
    id: 'condition',
    type: 'Condition',
    icon: <FlowIcon />,
    color: '#f44336',
    description: 'Conditional branching'
  }
];

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [lastSavedWorkflowId, setLastSavedWorkflowId] = useState<number | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const component = workflowComponents.find(c => c.id === type);
      if (!component) return;

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: component.type,
          type: component.id,
          icon: component.icon,
          description: component.description,
          color: component.color,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowProperties(true);
  };

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) return;
    try {
      const payload = {
        name: workflowName,
        version: 1,
        nodes: nodes.map(n => ({ id: n.id, type: n.data?.type || n.type || 'custom', label: n.data?.label, data: n.data, position: n.position })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: (e as any).sourceHandle, targetHandle: (e as any).targetHandle, label: (e as any).label })),
        metadata: {},
      };
      const res = await saveWorkflow(payload as any);
      setLastSavedWorkflowId(res.workflow_id);
      alert(`Saved! ID=${res.workflow_id}, version=${res.version}`);
      setSaveDialog(false);
      setWorkflowName('');
    } catch (err: any) {
      alert(err?.message || 'Save failed');
    }
  };

  const handlePublish = async () => {
    try {
      let wfId = lastSavedWorkflowId;
      if (!wfId) {
        // auto-save first if not saved in this session
        if (!workflowName.trim()) {
          setSaveDialog(true);
          alert('Please provide a workflow name to save before publishing.');
          return;
        }
        const payload = {
          name: workflowName,
          version: 1,
          nodes: nodes.map(n => ({ id: n.id, type: n.data?.type || n.type || 'custom', label: n.data?.label, data: n.data, position: n.position })),
          edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: (e as any).sourceHandle, targetHandle: (e as any).targetHandle, label: (e as any).label })),
          metadata: {},
        };
        const saved = await saveWorkflow(payload as any);
        wfId = saved.workflow_id;
        setLastSavedWorkflowId(wfId);
      }
      const pub = await publishWorkflow(wfId!);
      alert(`Published to Node-RED. Status=${pub.status}`);
    } catch (err: any) {
      alert(err?.message || 'Publish failed');
    } finally {
      setMenuAnchor(null);
    }
  };

  const handleGetAISuggestions = async () => {
    // Mock AI suggestions for demo
    const suggestions = [
      {
        type: 'optimization',
        title: 'Add Error Handling',
        description: 'Consider adding error handling nodes after API calls',
        confidence: 0.85
      },
      {
        type: 'enhancement',
        title: 'Data Validation',
        description: 'Add data validation before processing',
        confidence: 0.78
      },
      {
        type: 'efficiency',
        title: 'Parallel Processing',
        description: 'These tasks can run in parallel for better performance',
        confidence: 0.92
      }
    ];
    setAiSuggestions(suggestions);
  };

  const handleExecuteWorkflow = () => {
    // Mock workflow execution
    console.log('Executing workflow with nodes:', nodes, 'and edges:', edges);
    alert('Workflow execution started! Check the console for details.');
  };

  const handleOpenNodeRed = () => {
    // Open Node-RED in a new tab
    window.open('http://localhost:1880/node-red', '_blank');
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      {/* Header */}
      <Box sx={{ p: 2, backgroundColor: '#1a1f2e', borderBottom: '1px solid #2a3441' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 600 }}>
            🔧 Workflow Builder
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AIIcon />}
              onClick={handleGetAISuggestions}
              sx={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
            >
              AI Suggestions
            </Button>

            <Button
              variant="outlined"
              startIcon={<NodeRedIcon />}
              onClick={handleOpenNodeRed}
              sx={{ borderColor: '#ff6b35', color: '#ff6b35' }}
            >
              Open Node-RED
            </Button>
            
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={handleExecuteWorkflow}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Execute
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => setSaveDialog(true)}
              sx={{ backgroundColor: '#8b5cf6' }}
            >
              Save
            </Button>

            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreIcon sx={{ color: '#b8c5d1' }} />
            </IconButton>
          </Box>
        </Box>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {aiSuggestions.map((suggestion, index) => (
              <Alert
                key={index}
                severity="info"
                sx={{ 
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  color: '#00d4ff',
                  border: '1px solid rgba(0, 212, 255, 0.3)'
                }}
                onClose={() => {
                  setAiSuggestions(prev => prev.filter((_, i) => i !== index));
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {suggestion.title}
                </Typography>
                <Typography variant="caption">
                  {suggestion.description} (Confidence: {(suggestion.confidence * 100).toFixed(0)}%)
                </Typography>
              </Alert>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Toolbox Panel */}
        <ToolboxPanel components={workflowComponents} />

        {/* Main Flow Area */}
        <Box
          ref={reactFlowWrapper}
          sx={{ 
            flexGrow: 1, 
            backgroundColor: '#0a0e1a',
            position: 'relative'
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            style={{ backgroundColor: '#0a0e1a' }}
          >
            <Background color="#2a3441" gap={20} />
            <Controls 
              style={{
                backgroundColor: '#1a1f2e',
                border: '1px solid #2a3441'
              }}
            />
            <MiniMap 
              style={{
                backgroundColor: '#1a1f2e',
                border: '1px solid #2a3441'
              }}
              maskColor="#0a0e1a80"
            />
            
            {/* Instructions Panel */}
            <Panel position="top-center">
              <Card sx={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3441' }}>
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                    Drag components from the toolbox to build your workflow
                  </Typography>
                </CardContent>
              </Card>
            </Panel>
          </ReactFlow>
        </Box>

        {/* Properties Panel */}
        {showProperties && selectedNode && (
          <PropertiesPanel
            node={selectedNode}
            onClose={() => setShowProperties(false)}
            onUpdate={(updatedNode) => {
              setNodes((nds) =>
                nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
              );
            }}
          />
        )}
      </Box>

      {/* Save Dialog */}
      <Dialog 
        open={saveDialog} 
        onClose={() => setSaveDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1f2e',
            border: '1px solid #2a3441'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff' }}>Save Workflow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            fullWidth
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: '#b8c5d1' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#2a3441' },
                '&:hover fieldset': { borderColor: '#00d4ff' },
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialog(false)} sx={{ color: '#b8c5d1' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveWorkflow} sx={{ color: '#00d4ff' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1f2e',
            border: '1px solid #2a3441'
          }
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: '#ffffff' }}>
          <UploadIcon sx={{ mr: 2 }} />
          Import Workflow
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: '#ffffff' }}>
          <DownloadIcon sx={{ mr: 2 }} />
          Export Workflow
        </MenuItem>
        <MenuItem onClick={handlePublish} sx={{ color: '#00d4ff' }}>
          <FlowIcon sx={{ mr: 2 }} />
          Publish to Node-RED
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: '#ff6b35' }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Clear All
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkflowBuilder;