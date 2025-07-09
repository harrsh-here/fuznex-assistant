// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
   plugins: [require("tailwind-scrollbar")],

   
  extend: {
  animation: {
    'ping-slow': 'ping 2.5s ease-in-out infinite',
    'pop': 'pop 1.8s ease-in-out infinite',
    'squeeze': 'squeeze 2.5s ease-in-out infinite',
    'expand': 'expand 0.3s ease-out forwards',
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
}

};
