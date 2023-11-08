import path, { resolve } from 'path';
import TerserPlugin from "terser-webpack-plugin";
import NodeWebExternals from 'webpack-node-externals';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
	entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
		publicPath: "/",
    filename: 'bundle.mjs',
		clean: true,
  },
  mode: 'production',
  target: 'node',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.m?js$/,
  //       exclude: /(node_modules)/,
  //       use: {
  //         loader: 'babel-loader',
  //         options: {
  //           presets: ['@babel/preset-env']
  //         }
  //       }
  //     }
  //   ]
  // },
  externals: [NodeWebExternals()],
};

export default config;
