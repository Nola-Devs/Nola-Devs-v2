import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: '/src/components/index.ts',
			$data: '/src/data/index.ts',
			$images: '/src/images/index.ts',
			$appTypes: '/src/app.d.ts'
		}
	}
};

export default config;
