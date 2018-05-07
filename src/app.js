// If .bablerc enables `useBuiltIns: 'entry'`, then Babel will replace the
// following `import "@babel/polyfill"` with requires for `@babel/polyfill`
// based on environment, see https://github.com/babel/babel/tree/master/packages/babel-preset-env
import '@babel/polyfill';
import './scss/main.scss';
import Info from './components/info/info';
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

    this.initializeComponents();
  }

  initializeComponents() {
    // Initialize Info Panel
    this.infoComponent = new Info('info-sidebar');
    this.mapComponent = new Map('map');
  }
}

window.ctrl = new ViewController();
