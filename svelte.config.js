import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: path.resolve('./src/components/index.ts'),
			$data: path.resolve('./src/data/index.ts'),
			$images: path.resolve('./src/images/*'),
			$appTypes: path.resolve('./src/app.d.ts')
		}
	}
};

export default config;
