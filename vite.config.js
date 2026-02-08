import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        host: 'localhost', // Или '0.0.0.0', если нужен доступ с других устройств
        port: 5001,
        proxy: {
            // Прокси для PHP запросов
            '/php': {
                target: 'http://ospanel.local', // Куда перенаправляем
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path // Не меняем путь
            },
            // Или более конкретно:
            '/public/php': {
                target: 'http://ospanel.local',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/public/, '') // Если нужно убрать /public
            }
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    }
})