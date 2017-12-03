module.exports = {
  entry: './main.js',
  output: {
    filename: './bin/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};
