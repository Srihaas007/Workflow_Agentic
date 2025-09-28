import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import { theme } from '../../theme/colors';
import { authService, LoginCredentials } from '../../services/authService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoCredentials, setDemoCredentials] = useState<any>(null);

  useEffect(() => {
    // Load demo credentials on component mount
    loadDemoCredentials();
  }, []);

  const loadDemoCredentials = async () => {
    try {
      const credentials = await authService.getDemoCredentials();
      setDemoCredentials(credentials);
    } catch (error) {
      console.warn('Could not load demo credentials:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const credentials: LoginCredentials = {
        email_or_username: emailOrUsername,
        password: password,
        remember_me: rememberMe
      };

      const response = await authService.login(credentials);
      
      // Call the onLogin callback to update app state
      onLogin();
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // For now, implement social login as demo login
    setLoading(true);
    setError('');
    
    try {
      // Use demo admin credentials for social login
      if (demoCredentials?.admin) {
        const credentials: LoginCredentials = {
          email_or_username: demoCredentials.admin.email,
          password: demoCredentials.admin.password,
          remember_me: true
        };
        
        await authService.login(credentials);
        onLogin();
        navigate('/dashboard');
      } else {
        setError('Demo credentials not available');
      }
    } catch (error: any) {
      setError(`${provider} login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'user') => {
    if (demoCredentials && demoCredentials[type]) {
      setEmailOrUsername(demoCredentials[type].email);
      setPassword(demoCredentials[type].password);
      setError(''); // Clear any existing errors
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.background.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.gradients.primary,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.gradients.surface,
        }
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          mx: 2,
          backgroundColor: theme.background.paper,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.accent.primary}40`,
          borderRadius: 3,
          boxShadow: `0 8px 32px ${theme.accent.primary}20`,
          position: 'relative',
          zIndex: 1
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AIIcon sx={{ color: theme.accent.primary, fontSize: 40, mr: 1 }} />
              <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700 }}>
                AI Platform
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: theme.text.secondary }}>
              Sign in to your automation workspace
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, backgroundColor: theme.status.error + '20', color: theme.status.error }}>
              {error}
            </Alert>
          )}

          {/* Demo Credentials Info */}
          {demoCredentials && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                backgroundColor: theme.accent.primary + '20', 
                color: theme.accent.primary,
                border: `1px solid ${theme.accent.primary}40`
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Demo Credentials:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  size="small" 
                  onClick={() => fillDemoCredentials('admin')}
                  sx={{ 
                    color: theme.accent.primary, 
                    textTransform: 'none',
                    minWidth: 'auto',
                    p: 0.5,
                    fontSize: '0.75rem'
                  }}
                >
                  Admin: {demoCredentials.admin?.email}
                </Button>
                <Button 
                  size="small" 
                  onClick={() => fillDemoCredentials('user')}
                  sx={{ 
                    color: theme.accent.primary, 
                    textTransform: 'none',
                    minWidth: 'auto', 
                    p: 0.5,
                    fontSize: '0.75rem'
                  }}
                >
                  User: {demoCredentials.user?.email}
                </Button>
              </Box>
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or Username"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: theme.text.muted }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  '& fieldset': { borderColor: theme.border.primary },
                  '&:hover fieldset': { borderColor: theme.accent.secondary },
                  '&.Mui-focused fieldset': { borderColor: theme.accent.primary },
                },
                '& .MuiInputLabel-root': { color: theme.text.secondary },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.accent.primary },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: theme.text.muted }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: theme.text.muted }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  '& fieldset': { borderColor: theme.border.primary },
                  '&:hover fieldset': { borderColor: theme.accent.secondary },
                  '&.Mui-focused fieldset': { borderColor: theme.accent.primary },
                },
                '& .MuiInputLabel-root': { color: theme.text.secondary },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.accent.primary },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: theme.text.muted,
                      '&.Mui-checked': { color: theme.accent.primary },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    Remember me
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{ 
                  color: theme.accent.primary,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                backgroundColor: theme.accent.primary,
                color: theme.text.primary,
                '&:hover': { backgroundColor: theme.accent.hover },
                '&:disabled': { backgroundColor: theme.accent.primary + '60' },
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: theme.text.primary }} /> : 'Sign In'}
            </Button>

            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: theme.border.primary } }}>
              <Typography variant="body2" sx={{ color: theme.text.muted }}>
                Or continue with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin('Google')}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  color: theme.text.secondary,
                  borderColor: theme.border.primary,
                  backgroundColor: theme.background.secondary,
                  '&:hover': { 
                    backgroundColor: theme.accent.primary + '10',
                    borderColor: theme.accent.primary,
                    color: theme.accent.primary
                  },
                  textTransform: 'none',
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin('GitHub')}
                disabled={loading}
                startIcon={<GitHubIcon />}
                sx={{
                  py: 1.5,
                  color: theme.text.secondary,
                  borderColor: theme.border.primary,
                  backgroundColor: theme.background.secondary,
                  '&:hover': { 
                    backgroundColor: theme.accent.primary + '10',
                    borderColor: theme.accent.primary,
                    color: theme.accent.primary
                  },
                  textTransform: 'none',
                }}
              >
                GitHub
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{ 
                    color: theme.accent.primary,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;