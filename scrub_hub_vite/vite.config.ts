import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// NOTE: This file is not used in dev mode and probably doesn't really need to even exist right now.
export default defineConfig({
	plugins: [react()],
	base: '/static/', //FOR PRODUCTION Uncomment
	// build: {
	// 	outDir: '../scrub_hub_project/vite_dist', // place our output files in django directory
	// 	manifest: 'manifest.json', // required for django_vite
	// 	emptyOutDir: true,
	// 	rollupOptions: {
	// 		input: {
	// 			src: '/src/main.tsx',
	// 		}
	// 	}
	// }

})
