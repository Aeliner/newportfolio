module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        24: 'repeat(24, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        10: 'repeat(10, minmax(0, 1fr))',
      },
      boxShadow: {
        window: '0px 0px 3px 1px rgba(0, 0, 0, .5)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
