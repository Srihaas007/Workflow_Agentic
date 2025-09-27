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
  FormControlLabel,
  LinearProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  AutoAwesome as AIIcon,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    strength = Object.values(checks).filter(Boolean).length;
    return { strength, checks };
  };

  const { strength: passwordStrength, checks: passwordChecks } = getPasswordStrength();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('Please accept the Terms of Service');
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please choose a stronger password.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful signup
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please sign in with your credentials.' 
        }
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
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
        py: 4,
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
          maxWidth: 480,
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
              Create your automation workspace
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* SignUp Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#b8c5d1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#b8c5d1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                },
              }}
            />

            <TextField
              fullWidth
              label="Company (Optional)"
              value={formData.company}
              onChange={handleInputChange('company')}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: '#b8c5d1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
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
                  '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                },
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#b8c5d1', mr: 2 }}>
                    Password Strength:
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 5) * 100}
                    sx={{
                      flexGrow: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'rgba(184, 197, 209, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: passwordStrength >= 4 ? '#4caf50' : passwordStrength >= 3 ? '#ff9800' : '#f44336',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(passwordChecks).map(([key, passed]) => (
                    <Typography
                      key={key}
                      variant="caption"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: passed ? '#4caf50' : '#f44336',
                        fontSize: '0.75rem'
                      }}
                    >
                      {passed ? <CheckCircle sx={{ fontSize: 12, mr: 0.5 }} /> : <Cancel sx={{ fontSize: 12, mr: 0.5 }} />}
                      {key === 'length' ? '8+ chars' : key === 'uppercase' ? 'A-Z' : key === 'lowercase' ? 'a-z' : key === 'number' ? '0-9' : 'Special'}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              margin="normal"
              required
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
              helperText={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#b8c5d1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#b8c5d1' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                },
              }}
            />

            {/* Checkboxes */}
            <Box sx={{ mt: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    sx={{
                      color: '#b8c5d1',
                      '&.Mui-checked': { color: '#00d4ff' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                    I agree to the{' '}
                    <Link href="#" sx={{ color: '#00d4ff' }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" sx={{ color: '#00d4ff' }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    sx={{
                      color: '#b8c5d1',
                      '&.Mui-checked': { color: '#00d4ff' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                    Send me product updates and marketing emails
                  </Typography>
                }
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !agreeToTerms}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                backgroundColor: '#00d4ff',
                '&:hover': { backgroundColor: '#0099cc' },
                '&:disabled': { backgroundColor: 'rgba(0, 212, 255, 0.3)' },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Create Account'
              )}
            </Button>

            <Divider sx={{ mb: 3, borderColor: 'rgba(184, 197, 209, 0.3)' }}>
              <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                Or continue with
              </Typography>
            </Divider>

            {/* Social SignUp */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialSignUp('google')}
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
                onClick={() => handleSocialSignUp('github')}
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
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#00d4ff',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUp;