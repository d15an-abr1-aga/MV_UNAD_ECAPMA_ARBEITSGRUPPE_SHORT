/* tailwind-config.js — configuración común de Tailwind (CDN) para todo el sitio.
   Se carga justo después de https://cdn.tailwindcss.com */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        unad: { teal: '#00445B', navy: '#01333F', green: '#035B3B', orange: '#D26714', base: '#EAEAEA', darkbg: '#0a1922' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif']
      }
    }
  }
};
