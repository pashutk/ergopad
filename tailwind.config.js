const windmill = require('@windmill/react-ui/config');
// const colors = require('tailwindcss/colors');

module.exports = windmill({
  // mode: 'jit',
  purge: ['./src/**/*.tsx'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    //   colors: {
    //     transparent: 'transparent',
    //     current: 'currentColor',
    //     black: colors.black,
    //     white: colors.white,
    //     gray: colors.trueGray,
    //     indigo: colors.indigo,
    //     red: colors.rose,
    //     yellow: colors.amber,
    //   },
    extends: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
