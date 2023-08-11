import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        VantResolver()
      ],
    }),
    legacy({
      targets: ['last 2 versions and not dead, > 0.1%, Firefox ESR'],
    })
  ],
  build: {
    target: ['es5'],
    lib: {
      entry: resolve(__dirname, 'src/components/virtual-project-tree/virtual-project-tree.vue'), 
      name: 'VirutalProjectTree',
    },
    minify: 'terser',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
