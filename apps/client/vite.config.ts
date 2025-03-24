import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@components': path.join(__dirname, 'src/components'),
      '@pages': path.join(__dirname, 'src/pages'),
      '@store': path.join(__dirname, 'src/store'),
      '@util': path.join(__dirname, 'src/util'),
    },
  },
});
