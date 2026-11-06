import { hydrateRoot, createRoot } from 'react-dom/client';
import { App } from './app/App';
import { deploymentBase } from './lib/urls';
import './styles/site.css';
const root = document.getElementById('root')!;
const relative =
  '/' +
  window.location.pathname.slice(deploymentBase.length).replace(/^\//, '');
const path =
  root.dataset.path ??
  (relative === '/index.html'
    ? '/'
    : relative.endsWith('/')
      ? relative
      : relative + '/');
if (root.hasChildNodes()) hydrateRoot(root, <App path={path} />);
else createRoot(root).render(<App path={path} />);
