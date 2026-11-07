import { PrivacyPage } from '../pages/PrivacyPage';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import { StylepulsePage } from '../pages/StylepulsePage';
import { IqpublishPage } from '../pages/IqpublishPage';
import { WhitepapersPage } from '../pages/WhitepapersPage';
import { PaperAecPage } from '../pages/PaperAecPage';
import { PaperJavaPage } from '../pages/PaperJavaPage';
import { PaperRetailPage } from '../pages/PaperRetailPage';
export const routes = [
  { path: '/', key: 'home', Component: HomePage },
  { path: '/privacy/', key: 'privacy', Component: PrivacyPage },
  { path: '/contact/', key: 'contact', Component: ContactPage },
  { path: '/stylepulse/', key: 'stylepulse', Component: StylepulsePage },
  { path: '/iqpublish/', key: 'iqpublish', Component: IqpublishPage },
  { path: '/whitepapers/', key: 'whitepapers', Component: WhitepapersPage },
  {
    path: '/whitepapers/paper-aec/',
    key: 'paper_aec',
    Component: PaperAecPage,
    article: true,
  },
  {
    path: '/whitepapers/paper-java/',
    key: 'paper_java',
    Component: PaperJavaPage,
    article: true,
  },
  {
    path: '/whitepapers/paper-retail/',
    key: 'paper_retail',
    Component: PaperRetailPage,
    article: true,
  },
];
