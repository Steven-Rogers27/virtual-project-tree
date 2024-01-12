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
      name: 'CoolVirtualProjectTree',
	    formats: ['umd'],
    },

	  cssCodeSplit: true, // true css文件和umd格式的js包打在一起； false  css文件会单独抽出来。 在 lib 模式时，'es' 格式的包，css始终是被单独抽出来的。
    minify: 'terser', // 配合 terserOptions.compress.passes: 10，打出来的包比 'esbuild' 更小
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
