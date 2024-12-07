import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true, // Allow external access
    port: 3000,
    watch: {
      usePolling: true, // For file watchers in Docker/WSL environments
    },
  },
  build: {
    outDir: 'dist',
  },
});
