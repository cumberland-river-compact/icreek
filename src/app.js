// If .bablerc enables `useBuiltIns: 'entry'`, then Babel will replace the
// following `import "@babel/polyfill"` with requires for `@babel/polyfill`
// based on environment, see https://github.com/babel/babel/tree/master/packages/babel-preset-env
import '@babel/polyfill';
import './scss/main.scss';
import Navigo from 'navigo';
import Info from './components/info/info';
import About from './components/about/about';
import NotFound from './components/not-found/not-found';
import Map from './components/map/map';

const VISIBILITY = Object.freeze({
  closed: 'closed',
  open: 'open',
});

function toggleInfo() {
  const sidebar = document.querySelector('#info-sidebar');
  sidebar.classList.toggle(VISIBILITY.open);
  sidebar.classList.toggle(VISIBILITY.closed);
}

function toggleSettings() {
  const sidebar = document.querySelector('#settings-sidebar');
  sidebar.classList.toggle(VISIBILITY.open);
  sidebar.classList.toggle(VISIBILITY.closed);
}

// This is our main UI controller class
class ViewController {
  // Initialize the app
  constructor() {
    // Side panels are open, close them until needed.
    toggleInfo();
    toggleSettings();

    this.initializeRoutes();
  }

  initializeRoutes() {
    const baseTag = document.querySelector('base');
    const root = baseTag.attributes.href.value;
    // If useHash is true, then the router uses an old routing approach with
    // hash in the URL. Navigo falls back to this mode if there's no History API.
    const useHash = false;
    // No need to use #! for client side routes.
    // https://webmasters.googleblog.com/2015/10/deprecating-our-ajax-crawling-scheme.html
    const hash = '#';
    const router = new Navigo(root, useHash, hash);
    router.on({
      about: () => {
        this.aboutComponent = new About('content');
      },
      map: () => {
        this.mapComponent = new Map('content');
        this.infoComponent = new Info('info-sidebar');
      },
      '*': () => {
        this.mapComponent = new Map('content');
        this.infoComponent = new Info('info-sidebar');
      },
    });

    // Set the 404 route.
    router.notFound(() => {
      this.notFoundComponent = new NotFound('content');
    });

    router.resolve();
  }
}

window.ctrl = new ViewController();
