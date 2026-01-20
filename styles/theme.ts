export const theme = {
  colors: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    danger: '#DC2626',
    success: '#16A34A',
    blue: '#3B82F6',

    background: '#0F172A',
    surface: 'white',
    card: '#1F2933',

    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
  },

  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },

  shadow: {
    sm: '0 4px 10px rgba(0,0,0,0.25)',
    md: '0 10px 30px rgba(0,0,0,0.35)',
  },

  transition: {
    fast: '0.15s ease',
    normal: '0.3s ease',
  },
};

export type ThemeType = typeof theme;