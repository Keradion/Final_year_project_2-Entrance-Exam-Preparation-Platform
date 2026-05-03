import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // If 5173 is in use, try the next port instead of failing (avoids "localhost refused").
    strictPort: false,
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: false,
  },
})
