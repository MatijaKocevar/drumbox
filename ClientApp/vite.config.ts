import { defineConfig } from 'vite'
import 'dotenv/config';
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      port: 44434,
      https: {
        key: process.env.SSL_KEY_FILE,
        cert: process.env.SSL_CRT_FILE,
      },
      strictPort: true,
      proxy: {
        '/api': {
          target: 'https://localhost:7203',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
  }
})
