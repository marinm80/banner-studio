import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the app from /banner-studio/, everywhere else from the root.
  base: process.env.GITHUB_PAGES ? '/banner-studio/' : '/',
  server: { port: 5299, strictPort: true },
});
