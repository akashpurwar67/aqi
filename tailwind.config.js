module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the paths based on your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Ensure this line is present
  ],
};




