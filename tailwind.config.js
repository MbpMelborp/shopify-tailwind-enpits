module.exports = {
  // prefix: 'twcss-',
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    screens: {
      sm: '320px',
      md: '750px',
      lg: '990px',
      xlg: '1440px',
      x2lg: '1920px',
      pageMaxWidth: '1440px',
    },
    extend: {
      fontFamily: {
        heading: 'var(--font-heading-family)',
      },
      colors: {
        rojo: '#FA0014',
        negro: '#0A0A0A',
        blanco: '#FFFFFF',
        denim: '#003366',
        azul: '#0082FF',
        gris: '#EFEFEF',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
      },
    },
  },
  plugins: [],
};
