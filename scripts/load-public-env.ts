import { loadEnv } from 'vite';
// Match Vite's production .env loading for the separate Node prerender process.
// Existing process settings take precedence, including GitHub Actions variables.
Object.assign(
  process.env,
  loadEnv('production', process.cwd(), 'VITE_PUBLIC_'),
);
