import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import sitemap from './scripts/plugin-sitemap.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue(), sitemap(env.VITE_SITE_URL)],
  }
})
