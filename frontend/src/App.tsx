import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import EmailAutomation from './pages/EmailAutomation';
import TaskScheduler from './pages/TaskScheduler';
import APIHub from './pages/APIHub';
import WorkflowAdvisor from './pages/WorkflowAdvisor';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Auth Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';

const drawerWidth = 280;
const collapsedWidth = 64;

// Create dark theme inspired by your existing patterns
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      dark: '#0099cc',
      light: '#33ddff'
    },
    secondary: {
      main: '#ff6b35',
      dark: '#cc5529',
      light: '#ff8659'
    },
    background: {
      default: '#0a0e1a',
      paper: '#1a1f2e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b8c5d1'
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#ffffff'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#ffffff'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#ffffff'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f2e',
          borderRadius: 12,
          border: '1px solid #2a3441'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500
        }
      }
    }
  }
});

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to false for proper auth flow

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If not authenticated, show auth routes
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
            <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                width: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedWidth}px)`,
                transition: darkTheme.transitions.create('width', {
                  easing: darkTheme.transitions.easing.sharp,
                  duration: darkTheme.transitions.duration.enteringScreen,
                }),
              }}
            >
              <Header onLogout={() => setIsAuthenticated(false)} />
              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1, 
                  p: 3,
                  backgroundColor: '#0a0e1a',
                  minHeight: 'calc(100vh - 64px)'
                }}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/workflow-builder" element={<WorkflowBuilder />} />
                  <Route path="/workflows" element={<WorkflowBuilder />} />
                  <Route path="/workflow-templates" element={<WorkflowBuilder />} />
                  <Route path="/email-automation" element={<EmailAutomation />} />
                  <Route path="/task-scheduler" element={<TaskScheduler />} />
                  <Route path="/api-hub" element={<APIHub />} />
                  <Route path="/workflow-advisor" element={<WorkflowAdvisor />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;