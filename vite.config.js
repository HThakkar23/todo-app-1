import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
base: process.env.VITE_BASE_PATH || "/todo-app-1/",
  build: {
    rollupOptions: {
      input: 'index.html', // Ensure this points to the correct entry file
    },
  },


})

