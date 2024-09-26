import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Loaded env:', env) // For debugging

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
      //Weather URL expires in mid september
      'import.meta.env.VITE_WEATHER': JSON.stringify(env.VITE_WEATHER),
      'import.meta.env.VITE_NEWS': JSON.stringify(env.VITE_NEWS),
      'import.meta.env.VITE_CURRENCY': JSON.stringify(env.VITE_CURRENCY), // Added Currency API key
      'import.meta.env.VITE_CURRENCY_NEW': JSON.stringify(env.VITE_CURRENCY_NEW), // Added Currency API key
      'import.meta.env.VITE_CURRENCY_NEW2': JSON.stringify(env.VITE_CURRENCY_NEW2), // Added Currency API key
      'import.meta.env.VITE_APININJA': JSON.stringify(env.VITE_APININJA), // Added API NINJA
      'import.meta.env.TELEGRAMBOT': JSON.stringify(env.TELEGRAMBOT) // Added TELEGRAM API



    },
    // You can expose other environment variables if needed
    // 'import.meta.env.SOME_OTHER_VAR': JSON.stringify(env.SOME_OTHER_VAR)
  }
})