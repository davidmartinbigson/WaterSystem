import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pagesBase = process.env.GITHUB_PAGES === 'true' ? '/WaterSystem/' : '/';

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
