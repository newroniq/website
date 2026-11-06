import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { deploymentBase } from './src/lib/urls.ts';
export default defineConfig({
  base: deploymentBase,
  plugins: [react()],
  build: { manifest: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
