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
  Alert,
  InputAdornment,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AutoAwesome as AIIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['Enter Email', 'Verify Code', 'Reset Password'];

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Reset code sent to ${email}`);
      setActiveStep(1);
    } catch (err) {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (resetCode === '123456') {
        setSuccess('Code verified successfully');
        setActiveStep(2);
      } else {
        setError('Invalid reset code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password reset successfully');
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successfully! Please sign in with your new password.' 
          }
        });
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Reset code resent to your email');
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setLoading(false);
    }
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
          maxWidth: 450,
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
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate('/login')}
              sx={{
                color: '#b8c5d1',
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  color: '#00d4ff'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <AIIcon sx={{ color: '#00d4ff', fontSize: 32, mr: 1 }} />
                <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Reset Password
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
                {activeStep === 0 && "Enter your email to receive a reset code"}
                {activeStep === 1 && "Enter the verification code sent to your email"}
                {activeStep === 2 && "Create your new password"}
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': { color: '#00d4ff' },
              '& .MuiStepLabel-root .Mui-active': { color: '#00d4ff' },
              '& .MuiStepConnector-root': { 
                '& .MuiStepConnector-line': { 
                  borderColor: 'rgba(184, 197, 209, 0.3)' 
                }
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: '#00d4ff'
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: '#b8c5d1' }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && activeStep < 2 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Step Content */}
          {activeStep === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a code to reset your password.
              </Alert>
              <Box component="form" onSubmit={handleEmailSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#00d4ff',
                    '&:hover': { backgroundColor: '#0099cc' },
                    '&:disabled': { backgroundColor: 'rgba(0, 212, 255, 0.3)' },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                We've sent a 6-digit code to <strong>{email}</strong>. For demo purposes, use code: <strong>123456</strong>
              </Alert>
              <Box component="form" onSubmit={handleCodeSubmit}>
                <TextField
                  fullWidth
                  label="Verification Code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter 6-digit code"
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                    },
                  }}
                />
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#b8c5d1', mb: 1 }}>
                    Didn't receive the code?
                  </Typography>
                  <Button
                    onClick={handleResendCode}
                    disabled={loading}
                    sx={{
                      color: '#00d4ff',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: 'rgba(0, 212, 255, 0.1)' }
                    }}
                  >
                    Resend Code
                  </Button>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || resetCode.length !== 6}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#00d4ff',
                    '&:hover': { backgroundColor: '#0099cc' },
                    '&:disabled': { backgroundColor: 'rgba(0, 212, 255, 0.3)' },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              {success ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                    Password Reset Successfully!
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b8c5d1', mb: 2 }}>
                    Redirecting you to the login page...
                  </Typography>
                  <CircularProgress sx={{ color: '#00d4ff' }} />
                </Box>
              ) : (
                <Box component="form" onSubmit={handlePasswordReset}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
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
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    error={confirmPassword !== '' && newPassword !== confirmPassword}
                    helperText={confirmPassword !== '' && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#b8c5d1' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(184, 197, 209, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#00d4ff',
                      '&:hover': { backgroundColor: '#0099cc' },
                      '&:disabled': { backgroundColor: 'rgba(0, 212, 255, 0.3)' },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#b8c5d1' }}>
              Remember your password?{' '}
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

export default ForgotPassword;