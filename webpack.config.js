const path = require('path');

module.exports = {

  entry: ['@babel/polyfill', './working-docs/assets/scripts/App.js'],

  output: {
      path: path.resolve(__dirname, 'working-docs'),
      filename: 'temp/scripts/App.js'
  },

  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader'
              }
          }
      ]

  },
  mode: 'development'
};
