import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
      // ── Backend API (Spring Boot on port 8080) ────────
      '/api/docs': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
