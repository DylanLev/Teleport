import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Loaded env:', env) // Pour le débogage

  return {
    plugins: [react()],
    root: path.resolve(__dirname, 'front/teleport'),
    build: {
      outDir: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'front/teleport/src'),
      },
    },
    define: {
      'import.meta.env.VITE_WEATHER': JSON.stringify(env.VITE_WEATHER),
      'import.meta.env.VITE_NEWS': JSON.stringify(env.VITE_NEWS) // Added News API key
    },
    // Vous pouvez également exposer d'autres variables d'environnement si nécessaire
    // 'import.meta.env.SOME_OTHER_VAR': JSON.stringify(env.SOME_OTHER_VAR)
  }
})