// Modern color theme configuration for the AI Automation Platform
export const theme = {
  // Primary background colors - Moving to warmer, more modern tones
  background: {
    primary: '#0f172a',     // Rich dark slate (was #0a0e1a)
    secondary: '#1e293b',   // Warmer slate (was #1a1f2e)
    tertiary: '#334155',    // Elevated surfaces (was #2a3441)
    paper: 'rgba(30, 41, 59, 0.95)', // Glass morphism cards
  },

  // Accent colors - Modern purple/violet theme
  accent: {
    primary: '#8b5cf6',     // Vibrant violet (was #00d4ff)
    secondary: '#a78bfa',   // Light violet
    tertiary: '#c4b5fd',    // Very light violet
    hover: '#7c3aed',       // Darker violet for hovers
  },

  // Success/Error/Warning colors
  status: {
    success: '#10b981',     // Emerald green
    warning: '#f59e0b',     // Amber
    error: '#ef4444',       // Red
    info: '#06b6d4',        // Cyan
  },

  // Text colors
  text: {
    primary: '#f8fafc',     // Almost white
    secondary: '#cbd5e1',   // Light gray
    muted: '#94a3b8',       // Medium gray
    disabled: '#64748b',    // Dark gray
  },

  // Border colors
  border: {
    primary: '#475569',     // Slate border (was #2a3441)
    secondary: '#64748b',   // Lighter border
    focus: '#8b5cf6',       // Violet focus border
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    surface: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
  },

  // Component specific colors
  components: {
    sidebar: {
      background: '#1e293b',
      active: 'rgba(139, 92, 246, 0.15)',
      hover: 'rgba(139, 92, 246, 0.08)',
    },
    header: {
      background: '#1e293b',
      notification: 'rgba(239, 68, 68, 0.2)', // Red notification
      profile: 'rgba(139, 92, 246, 0.2)',     // Violet profile
    },
    card: {
      background: '#1e293b',
      border: '#475569',
      hover: '#334155',
    },
    button: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: 'rgba(139, 92, 246, 0.1)',
      secondaryHover: 'rgba(139, 92, 246, 0.2)',
    },
    input: {
      background: '#334155',
      border: '#475569',
      focus: '#8b5cf6',
    }
  }
};

// Color utility functions
export const colorUtils = {
  // Add opacity to any color
  withOpacity: (color: string, opacity: number) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  
  // Get status color with opacity
  getStatusColor: (status: 'success' | 'warning' | 'error' | 'info', opacity: number = 1) => {
    const colors = {
      success: theme.status.success,
      warning: theme.status.warning,
      error: theme.status.error,
      info: theme.status.info,
    };
    return opacity === 1 ? colors[status] : colorUtils.withOpacity(colors[status], opacity);
  },

  // Get accent color with opacity  
  getAccentColor: (opacity: number = 1) => {
    return opacity === 1 ? theme.accent.primary : colorUtils.withOpacity(theme.accent.primary, opacity);
  }
};

export default theme;