// If .bablerc enables `useBuiltIns: 'entry'`, then Babel will replace the
// following `import "@babel/polyfill"` with requires for `@babel/polyfill`
// based on environment, see https://github.com/babel/babel/tree/master/packages/babel-preset-env
import '@babel/polyfill';
import './scss/main.scss';

// This is our main UI controller class
class ViewController {
  // Initialize the app
  constructor() {
    const s = 'Hello, World!';
    console.log(s);
  }
}

window.ctrl = new ViewController();
