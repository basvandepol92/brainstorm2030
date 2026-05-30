import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Base path is set for GitHub Pages project sites (https://<user>.github.io/<repo>/).
// Override with VITE_BASE locally or in CI when the repo name differs.
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
