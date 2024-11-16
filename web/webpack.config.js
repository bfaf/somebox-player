const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, '../public/index.html'),
  filename: 'index.html',
  inject: 'body',
});

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /(\.js|\.ts|\.tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.web.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: false,
      presets: ['module:@react-native/babel-preset'],
      // Re-write paths to import only the modules needed by the app
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.web.js'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  // ...the rest of your config

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  devServer: {
    // static: {
    //   directory: path.join(__dirname, '../dist'),
    // },
    compress: true,
    port: 3000,
    allowedHosts: 'all',
    client: {
      overlay: true,
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:30500',
      },
    ],
  },

  plugins: [HTMLWebpackPluginConfig],

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      'react-native$': 'react-native-web',
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [
      '.web.js',
      '.web.jsx',
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
};
