module.exports = {
  entry: './src/media-query/media-query.ts',
  output: {
    filename: 'dist/material-layouts.bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.ts']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};
