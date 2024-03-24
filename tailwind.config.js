/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			screens: {
				'3xl': '2000px'
			},
			fontFamily: {
				cute: 'Cute Font, sans-serif'
			},
			backgroundImage: {
				homeBanner: "url('/src/lib/assets/banner.webp')",
				defaultBanner: "url('/src/lib/assets/default-banner.webp')"
				
			},
			colors: {
				primary: {
					50: '#edebfe',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7e22ce',
					800: '#6b21a8',
					900: '#24072F',
					dark: '#0E0015',
					light: '#F6F5FF'
				}
			}
		}
	},
	plugins: [require('flowbite/plugin')]
};
