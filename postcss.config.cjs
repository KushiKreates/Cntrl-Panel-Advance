module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'), // Use official Tailwind nesting
    require('tailwindcss'),        // Use official Tailwind CSS plugin
    require('autoprefixer'),
  ]
}
