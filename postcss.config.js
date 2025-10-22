module.exports = (ctx) => ({
  map: ctx.options.map ? { inline: false, annotation: true } : false,
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
  },
});
