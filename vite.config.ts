import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import site from './src/content/site.json' with { type: 'json' };
import { deploymentBase } from './src/lib/urls.ts';
export default defineConfig({
  base: deploymentBase,
  plugins: [
    react(),
    {
      name: 'site-favicon',
      transformIndexHtml(html) {
        return html.replace(
          '<!--favicon-->',
          `<link rel="icon" type="image/svg+xml" href="${deploymentBase.slice(0, -1)}${site.favicon}" />`,
        );
      },
    },
  ],
  build: { manifest: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
