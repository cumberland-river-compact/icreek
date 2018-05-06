const path = require('path');
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

// Export a function so that we can have access to arguments passed to Webpack.
// Args are needed to know if the desired mode is production or development.
// https://webpack.js.org/configuration/configuration-types/#exporting-a-function
module.exports = function(env, argv) {
  return {
    entry: './src/app.js',
    output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development', // override as needed with `webpack --mode production`
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
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
        template: './src/index.html',
        inject: false, // do not auto-inject, index.html specifies the location
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
      ],
    },
  };
};
