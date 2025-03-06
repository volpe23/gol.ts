import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		hmr: {
			timeout: 3000,
		},
		watch: {
			usePolling: true,
		},
	},
});
