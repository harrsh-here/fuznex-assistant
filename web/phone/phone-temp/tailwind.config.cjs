// web/phone/phone-temp/tailwind.config.js
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
       padding: {
      'safe-top': 'env(safe-area-inset-top)', // iOS notch-safe padding
    },
      
  animation: {
    'ping-slow': 'ping 2.5s ease-in-out infinite',
    'pop': 'pop 1.8s ease-in-out infinite',
    'squeeze': 'squeeze 2.5s ease-in-out infinite',
    'expand': 'expand 0.3s ease-out forwards',
    'spin-slow': 'spin 12s linear infinite',
  },
  keyframes: {
    pop: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.15)' },
    },
    squeeze: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.03)' },
    },
    expand: {
      '0%': { transform: 'scale(0.95)', opacity: 0 },
      '100%': { transform: 'scale(1)', opacity: 1 },
    },
  },
},
  },
    plugins: [require("tailwind-scrollbar")],
    
};
