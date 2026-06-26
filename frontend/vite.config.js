import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/signin': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/signup': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/forgot-password': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  },
  resolve: {
    alias: {
      '@'            : path.resolve(__dirname, './src'),
      '@components'  : path.resolve(__dirname, './src/components'),
      '@modules'     : path.resolve(__dirname, './src/modules'),
      '@calculator'  : path.resolve(__dirname, './src/calculator'),
      '@contact'     : path.resolve(__dirname, './src/contact'),
      '@layouts'     : path.resolve(__dirname, './src/layouts'),
      '@pages'       : path.resolve(__dirname, './src/pages'),
      '@utils'       : path.resolve(__dirname, './src/utils'),
      '@validations' : path.resolve(__dirname, './src/Validations'),
      '@styles'      : path.resolve(__dirname, './src/Styles'),
      '@assets'      : path.resolve(__dirname, './src/assets'),
    },
  },
})
