import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
export default {
	plugins: [
		require('autoprefixer'),
		// require('postcss-pixel-to-viewport')({
		// 	viewportWidth: 375,
		// }),
	],
}