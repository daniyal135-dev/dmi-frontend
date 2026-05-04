/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fade-in 0.8s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'count-up': 'count-up 1s ease-out',
        'scroll': 'scroll 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'rotate-3d': 'rotate-3d 10s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'wave': 'wave 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'neon-glow': 'neon-glow 1.5s ease-in-out infinite',
        'subtle-glow': 'subtle-glow 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)',
            transform: 'scale(1.05)',
          },
        },
        'rotate-3d': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'bounce-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.3)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.05)',
          },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.05)' },
        },
        'neon-glow': {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.5)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.8)',
          },
        },
        'subtle-glow': {
          '0%, 100%': {
            textShadow: '0 0 2px rgba(59, 130, 246, 0.2), 0 0 4px rgba(59, 130, 246, 0.15), 0 0 6px rgba(59, 130, 246, 0.1)',
          },
          '50%': {
            textShadow: '0 0 3px rgba(59, 130, 246, 0.3), 0 0 6px rgba(59, 130, 246, 0.25), 0 0 9px rgba(59, 130, 246, 0.2)',
          },
        },
      },
    },
  },
  plugins: [],
};

