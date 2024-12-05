import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': `https://texttoimageproject-backend.onrender.com`,  // Replace with your backend server URL and port
    },
  },
  build: {
    outDir: 'dist',  // Output build files to 'dist' folder
  },
})
