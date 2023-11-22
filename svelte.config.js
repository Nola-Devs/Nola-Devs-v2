import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components : path.resolve('./src/components/index.ts'),
			$data : path.resolve('./src/data/index.ts'),
			$images : path.resolve('./src/images/*')
		}
	}
}

export default config;
