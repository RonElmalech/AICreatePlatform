import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load environment variables from .env at the root level
dotenv.config({ path: '../.env' });

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': 'http://backend:5000/',  // Replace with your backend server URL and port
    },
  },
  build: {
    outDir: 'dist',  // Output build files to 'dist' folder
  },
  define: {
    'process.env': process.env,  // Ensure that env vars are correctly passed
  },
})
