import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // alamat backend kamu
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
