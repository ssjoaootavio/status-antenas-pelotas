import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// No build (GitHub Pages de projeto) o site fica sob "/status-antenas-pelotas/".
// Em dev, servimos a partir da raiz "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/status-antenas-pelotas/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
}));
