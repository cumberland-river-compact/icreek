const path = require('path');
// Our site is Single Page Application (SPA) with client side (in browser)
// routing. For this reason, we want index.html to be loaded for the root
// URL `/` as well as nested routes such as `/home`, `/about`, and `/map`.
// connect-history-api-fallback is a tiny middleware to address this issue
// when running the app locally with webpack-serve. (We have the same SPA
// routing issue with GitHub Pages hosting, but that is not addressed here.)
const history = require('connect-history-api-fallback');
// koa-connect is needed to run connect-history-api-fallback middleware
const convert = require('koa-connect');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Output styles to a CSS file that is referenced in index.html <head>.
// If we don't do this, then CSS stays in the JS bundle and the site will be
// unstyled when JS is disabled.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// While Webpack 5 is likely to come with a built-in CSS minimizer, with
// Webpack 4 we need need optimize-css-assets-webpack-plugin.
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// Setting optimization.minimizer overrides the defaults provided by Webpack,
// so explicit addition of UglifyJS is required too.
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Transpile our JavaScript down to ES5 for better browser support.
const babelLoader = {
  loader: 'babel-loader',
};

// Add CSS to the DOM by injecting a `<style>` tag.
const styleLoader = {
  loader: 'style-loader',
};

// Interpret `@import` and `url()` like `import/require()` and resolve them.
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
  },
};

// Process CSS with PostCSS.
const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins: function() {
      return [require('autoprefixer')];
    },
  },
};

// Load SASS/SCSS files and transpile them to CSS.
const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: true,
  },
};

// URL loader to resolve data-urls at build time
const urlLoader = {
  loader: 'url-loader',
  options: {
    limit: 100000,
  },
};

// Allow us to import HTML templates into JS component files
const htmlLoader = {
  loader: 'html-loader',
  options: {
    minimize: false,
    removeComments: false,
    collapseWhitespace: false,
  },
};

// Export a function so that we can have access to arguments passed to Webpack.
// Args are needed to know if the desired mode is production or development.
// https://webpack.js.org/configuration/configuration-types/#exporting-a-function
module.exports = function(env, argv) {
  return {
    entry: './src/app.js',
    output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, 'dist'),
      // For production, the app is hosted at https://cumberland-river-compact.github.io/icreek/
      // Keep this in sync with HtmlWebpackPlugin baseUrl
      publicPath: process.env.NODE_ENV === 'development' ? '/' : '/icreek/',
    },
    serve: {
      add: (app, middleware, options) => {
        const historyOptions = {
          // ... see: https://github.com/bripkens/connect-history-api-fallback#options
        };
        console.log('Adding history API fallback...');
        app.use(convert(history(historyOptions)));
      },
      // content: [__dirname],
      // dev: {
      //   publicPath: '/build/',
      // },
      // Hot is true by default, but set explicitly just for clarity.
      hot: true,
    },
    mode: 'development', // override as needed with `webpack --mode production`
    devtool: 'source-map', // enable JS source maps for development builds
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          // Make sourceMap true and redeploy if you need to debug production.
          // sourceMap: true,
        }),
        new OptimizeCssAssetsPlugin({
          // By default, this uses https://github.com/ben-eb/cssnano which
          // reads our .browserslistrc
          cssProcessorOptions: { discardComments: { removeAll: true } },
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        // Load a custom template (lodash by default)
        template: './src/index.template',
        inject: false, // do not auto-inject, index.html specifies the location
        // For production, the app is hosted at https://cumberland-river-compact.github.io/icreek/
        // Keep this in sync with output.publicPath
        baseUrl: process.env.NODE_ENV == 'development' ? '/' : '/icreek/',
      }),
      new MiniCssExtractPlugin({
        // Check for the existence of argv because Webpack will supply
        // it whereas webpack-serve will not.
        filename:
          argv && argv.mode === 'production'
            ? '[name].[contenthash].css'
            : '[name].css',
        chunkFilename:
          argv && argv.mode === 'production'
            ? '[id].[contenthash].css'
            : '[id].css',
        // Options are similar to the same options in webpackOptions.output.
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: babelLoader,
        },
        {
          test: /\.(sc|sa|c)ss$/, // sass, scss, or css
          use: [
            // We don't use MiniCssExtractPlugin on development builds
            // because, unlike style-loader, it does not support HMR.
            // However, the CSS in JS bundling of style-loader is not without
            // these limitations:
            // 1. You'll see a flash of unstyled content while the JS bundle is
            //    loaded and parsed.
            // 2. If JS is disabled, the content of <noscript> will not be
            //    styled, and in fact, the entire site will be unstyled.
            // Revisit this after mini-css-extract-plugin gets HMR support,
            // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
            argv && argv.mode === 'production'
              ? MiniCssExtractPlugin.loader
              : styleLoader,
            cssLoader,
            postCssLoader,
            sassLoader,
          ],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
          use: urlLoader,
        },
        {
          test: /\.html$/,
          use: htmlLoader,
        },
      ],
    },
  };
};
