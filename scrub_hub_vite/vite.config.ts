import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/static/',
	build: {
		outDir: '../scrub_hub_project/vite_dist', // place our output files in django directory
		manifest: 'manifest.json', // required for django_vite
		emptyOutDir: true,
		rollupOptions: {
			input: {
				src: '/src/main.tsx',
			}
		}
	}

})
