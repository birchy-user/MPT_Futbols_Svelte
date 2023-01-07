import { sveltekit } from '@sveltejs/kit/vite';
// import { API_ROOT } from '$env/static/private';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	// server: {
	// 	proxy: {
	// 		'/api': API_ROOT
	// 	}
	// },
	assetsInclude: ['**/*.xml']
};

export default config;
