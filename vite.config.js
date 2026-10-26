import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://theprimecareers.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://theprimecareers.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      ignored: ['**/backend/**', '**/dist/**'],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
