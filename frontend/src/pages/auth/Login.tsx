import React, { useState } from 'react';
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

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@example.com' && password === 'password') {
        onLogin();
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try demo@example.com / password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    setLoading(true);
    setTimeout(() => {
      onLogin();
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0a0e1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          mx: 2,
          backgroundColor: 'rgba(26, 31, 46, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AIIcon sx={{ color: '#00d4ff', fontSize: 40, mr: 1 }} />
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>
                AI Platform
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
              Sign in to your automation workspace
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Demo Credentials Info */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="body2">
              Email: demo@example.com<br />
              Password: password
            </Typography>
          </Alert>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#b8c5d1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(184, 197, 209, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4ff',
                  },
                },
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
                    <LockIcon sx={{ color: '#b8c5d1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#b8c5d1' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(184, 197, 209, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4ff',
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#b8c5d1',
                      '&.Mui-checked': {
                        color: '#00d4ff',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: '#00d4ff',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
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
                mb: 3,
                py: 1.5,
                backgroundColor: '#00d4ff',
                '&:hover': {
                  backgroundColor: '#0099cc',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ mb: 3, borderColor: 'rgba(184, 197, 209, 0.3)' }}>
              <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                Or continue with
              </Typography>
            </Divider>

            {/* Social Login */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  borderColor: 'rgba(184, 197, 209, 0.3)',
                  color: '#b8c5d1',
                  '&:hover': {
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                startIcon={<GitHubIcon />}
                sx={{
                  borderColor: 'rgba(184, 197, 209, 0.3)',
                  color: '#b8c5d1',
                  '&:hover': {
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                GitHub
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#b8c5d1' }}>
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  color: '#00d4ff',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;