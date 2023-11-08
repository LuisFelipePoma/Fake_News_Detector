const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist-dev'),
		publicPath: "/",
    filename: 'bundle.js',
		clean: true,
  },
	mode: 'development',
	target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Configura el loader que estés utilizando
      },
    ],
  },
};
