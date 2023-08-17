import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
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
  ],
  build: {
    target: ['chrome80'],
    lib: {
      entry: resolve(__dirname, 'src/components/virtual-project-tree/index.ts'),
      name: 'VirutalProjectTree',
	    formats: ['umd'],
    },

	  cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        module: true,
        passes: 10,
      },
      mangle: {
        module: true,
        toplevel: true,
      },
    },
    rollupOptions: {
      external: ['vue', 'vant'],
      output: {
        globals: {
          vue: 'Vue',
	        vant: 'vant',
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.100.199:12777',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
