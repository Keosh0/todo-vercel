import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Библиотеки (React, ReactDOM) выносятся в отдельный файл vendor: они меняются редко,
        // поэтому браузер берёт их из кэша, а после деплоя заново скачивает только код приложения
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
