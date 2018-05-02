import './scss/app.scss';
// If .bablerc enables `useBuiltIns: 'entry'`, then Babel will replace the
// following `import "@babel/polyfill"` with requires for `@babel/polyfill`
// based on environment, see https://github.com/babel/babel/tree/master/packages/babel-preset-env
import "@babel/polyfill";

// This function is to demonstrate Babel.
// Search for "World" in the dist/ output bundle to see what has changed.
(function() {
  const transpileThis = () => {
    const s = 'Hello, World!';
    console.log(s);
  };
  transpileThis();
})();
