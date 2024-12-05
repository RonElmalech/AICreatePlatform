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
      '/api': `${import.meta.VITE_BACKEND_URL}`,  // Replace with your backend server URL and port
    },
  },
  build: {
    outDir: 'dist',  // Output build files to 'dist' folder
  },
})
