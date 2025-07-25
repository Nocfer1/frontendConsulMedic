import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        strictPort: true,
        host: true
    },
    base: './',
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    }
})