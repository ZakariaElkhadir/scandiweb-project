import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy requests starting with /graphql for backend
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true, 
        secure: false,    
       
      }
     
    }
  }
})
