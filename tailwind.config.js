/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Force consistent theme colors regardless of system preferences
        'cream': {
          50: '#fefdfb',   // Warm off-white background
          100: '#fef3e2',  // Light golden cream
          200: '#fed7aa',  // Warmer golden cream
          300: '#fdba74',  // Medium cream
        },
        'warm': {
          50: '#fffbf0',   // Very light warm white
          100: '#fef3c7',  // Light golden background
        },
        'golden': '#f59e0b',      // Beautiful golden yellow
        'golden-dark': '#d97706', // Darker golden yellow
        'soft-gray': '#6b5b47',   // Warm brown for secondary text
        
        // Override system grays with warm variants
        'theme-gray': {
          50: '#fffbf0',   // Very light warm background
          100: '#fef3e2',  // Light warm background  
          200: '#fed7aa',  // Warm light gray
          300: '#fdba74',  // Warm medium gray
          400: '#f59e0b',  // Golden
          500: '#d97706',  // Golden dark
          600: '#6b5b47',  // Warm brown
          700: '#4a3f33',  // Dark warm brown
          800: '#2d1b0e',  // Very dark brown
          900: '#1a1108',  // Almost black brown
        },
      },
      backgroundColor: {
        'card': '#ffffff',        // Force white card backgrounds
        'background': '#fefdfb',  // Warm off-white
        'secondary': '#fffbf0',   // Very light warm white
      },
      textColor: {
        'primary': '#2d1b0e',     // Dark brown for excellent contrast
        'secondary': '#6b5b47',   // Warm brown for secondary text
        'muted': '#4a3f33',       // Medium warm brown
      },
      borderColor: {
        'default': '#e5e7eb',     // Soft neutral border
        'cream': '#fed7aa',       // Cream border
      },
    },
  },
  plugins: [],
}