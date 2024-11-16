/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Mengaktifkan dark mode berbasis kelas
  content: [
    "./src/**/*.{html,js,jsx}", // masukkan .jsx di sini untuk proyek JS
  ],
  theme: {
    extend: {
      colors: {
        costumLight: '#1A103D'
      }
    },
  },
  plugins: [
    require("daisyui"), // Tambahkan DaisyUI ke plugins
  ],
}
