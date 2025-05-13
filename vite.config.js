import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
base: process.env.VITE_BASE_PATH || "/todo-app-1",


root: path.resolve(__dirname, 'public'), // Adjust the path as needed
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html')
    }
  }


})

