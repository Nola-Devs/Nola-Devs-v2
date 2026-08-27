import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components/index.ts',
			$types: 'src/app.d.ts'
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
