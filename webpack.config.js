const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development', // override as needed with `webpack --mode production`
  plugins: [
    new HtmlWebpackPlugin({
      // Load a custom template (lodash by default)
      template: './src/index.html',
      inject: false, // do not auto-inject, index.html specifies the location
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
        test: /\.(scss)$/,
        use: [styleLoader, cssLoader, postCssLoader, sassLoader],
      },
    ],
  },
};
