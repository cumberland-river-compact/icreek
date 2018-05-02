iCreek "vNext"
==============
Hackathon environments are great for creativity and prototyping, but not so
great for building *sustainable*, *rock-solid* applications. This experimental
rewrite will attempt to improve performance, browser support, and dev
experience of our original iCreek hackathon app.

A number of new tools and libraries will be employed to meet these goals.
Some are only `devDependencies` (meaning they are only used for
development and not included in the final deployment). Others (like
Bootstrap 4 and html5shiv) are actual runtime `dependencies`; they contribute
to the overall size and complexity of the application, so we will only add
them if their benefit is substantial.

## Meeting Our Goals

For **better performance**:

* Bundle, and minify assets for faster page loads and reduced bandwidth
  requirements. This is especially important on mobile devices and low
  bandwidth connections. *[Webpack]*
* Use small libraries when possible. *[[Leaflet](http://leafletjs.com/) vs. Esri JavaScript API]*
* Tell browsers to cache our files forever and use
  [cache bursting](https://www.keycdn.com/support/what-is-cache-busting/) to
  deploy new versions. *[[Webpack](https://webpack.js.org/guides/caching/)]*
* Serve the files on a fast, reliable host that uses gzip compression. *[GitHub Pages]*

For **better browser support**:

* [Transpile JavaScript to ES5](https://scotch.io/tutorials/javascript-transpilers-what-they-are-why-we-need-them)
  and [polyfill as needed](https://stackoverflow.com/a/7087370/23566). *[[Babel](https://babeljs.io/)]*
* Use CSS with strong cross-browser compatibility. *[Bootstrap 4 vs. Bulma]*
* Warn the user if they are running an outdated browser.
* Normalize the baseline CSS of browsers. *[Bootstrap 4 includes [Reboot](https://scotch.io/tutorials/a-look-at-bootstrap-4s-new-reset-rebootcss)]*
* Shim old browsers to understand HTML5 elements. *[[html5shiv](https://github.com/aFarkas/html5shiv)]*

For a **better dev experience**:

* Use hot reloading. *[[Webpack](https://webpack.js.org/guides/hot-module-replacement/) and [webpack-serve](https://github.com/webpack-contrib/webpack-serve)]*
* Use consistent formatting. *[[Prettier](https://prettier.io/docs/en/why-prettier.html)]*
* Enforce JavaScript rules and formatting. *[[ESlint](https://eslint.org/)]*
* Automatically add CSS vendor prefixes. *[[Autoprefixer](https://css-tricks.com/autoprefixer/)]*
* Write modern JavaScript and transpile to ES5 as needed. *[[Babel](https://babeljs.io/)]*
* Create debug source maps for local dev environments. *[Webpack]*

## Getting Started
```Shell
git clone https://github.com/cumberland-river-compact/icreek.git
cd icreek
npm install
npm run dev # open http://localhost:8080
```

## Code Quality
We use ESLint. Run `npm run lint` to test our JS against
[Prettier](https://prettier.io/docs/en/why-prettier.html) and the
[Airbnb Style Guide](https://github.com/airbnb/javascript).

* Prettier is all about formatting (number of spaces,
  where to place line breaks, etc.)
* Airbnb has both formatting and non-formatting rules (number of spaces,
  how to code with Arrays, how to order imports, etc.)

In cases where they conflict, Prettier formatting will override Airbnb.

## Production Deployments
Run `npm run build` to create a production build. The output goes into
`dist/`. We can move these files into a
[branch for GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)
via [git-directory-deploy](https://github.com/X1011/git-directory-deploy).
