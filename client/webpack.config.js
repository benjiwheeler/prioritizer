// var Clean = require('clean-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';

const config = {
  entry: [
    'es5-shim/es5-shim',
    'es5-shim/es5-sham',
    'babel-polyfill',
    './app/bundles/HelloWorld/startup/HelloWorldApp',
    // './app/bundles/jquery.lettering.js',
    './app/bundles/misc',
  ],

  output: {
    filename: 'webpack-bundle.js',
    path: '../app/assets/webpack',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
    alias: { // use non-minified src jquery: http://stackoverflow.com/a/28989476/2308190
      jquery: "jquery/src/jquery"
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    // so not everyone needs to explicitly include jquery
    //https://webpack.github.io/docs/shimming-modules.html
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // }),
  ],
  module: {
    loaders: [
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      // },
      {
        test: require.resolve('react'),
        loader: 'imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;

if (devBuild) {
  console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
  module.exports.devtool = 'eval-source-map';
} else {
  config.plugins.push(
    new webpack.optimize.DedupePlugin()
  );
  console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}
