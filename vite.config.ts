import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: ['.blink.new'],
  },
  build: {
    sourcemap: false,
    outDir: 'dist'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@use-gesture/react',
      'date-fns',
      'dompurify',
      'lucide-react',
      'zustand',
      'country-list',
      'react-select',
      'react-select-country-list'
    ]
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
});