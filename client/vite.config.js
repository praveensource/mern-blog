import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api': 'http://localhost:3000',
      secure: false,

    },
  },
  plugins: [react()],
  define: {
    global: 'window', // Vite doesn't provide `global` by default
  },
})
