import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determinar si estamos en modo desarrollo o producción
// Para desarrollo local: usar localhost
// Para Docker: usar el nombre del servicio 'backend'
const isDocker = process.env.DOCKER === 'true';
const apiTarget = isDocker || process.env.NODE_ENV === 'production' 
  ? 'http://backend:4000' 
  : 'http://localhost:4000';

console.log(`Vite config: API target set to ${apiTarget}`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      }
    }
  }
}) 