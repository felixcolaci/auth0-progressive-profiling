import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import replace from '@rollup/plugin-replace';


const netlify = process.env.NETLIFY === 'true';
const base_path = netlify ? 'https://auth0-progressive-profiling.netlify.app' : 'http://localhost:9999';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		prerender: {
			default: false
		},
		vite: {
		  plugins: [
			replace({
				'process.env.BASE_PATH': base_path
			})
		]
	}
	},
	
};

export default config;
