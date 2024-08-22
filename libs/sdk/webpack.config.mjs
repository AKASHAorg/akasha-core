import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';

import { InjectManifest } from 'workbox-webpack-plugin';
import { EsbuildPlugin } from 'esbuild-loader';

import { SubresourceIntegrityPlugin } from 'webpack-subresource-integrity';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { fileURLToPath } from 'url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProduction = process.env.NODE_ENV === 'production';
const config = [
  {
    entry: './src/index.ts',
    context: path.resolve(__dirname),
    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: 'esbuild-loader',
          options: { tsconfig: './tsconfig.json' },
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '*.mjs', '.*.mjs'],
      alias: {
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
      },
      fallback: {
        os: false,
        crypto: false,
        http: false,
        https: false,
        dns: false,
        fs: false,
        assert: require.resolve('assert'),
        path: require.resolve('path-browserify/'),
        stream: require.resolve('stream-browserify/'),
        util: require.resolve('util/'),
      },
    },
    output: {
      path: path.resolve(__dirname, '../../dist/libs/sdk'),
      filename: 'akasha.sdk.js',
      //library: 'awfSDK',
      libraryTarget: 'system',
      publicPath: 'auto',
      crossOriginLoading: 'anonymous',
      clean: true,
    },
    target: ['web', 'es2022'],
    optimization: {
      minimizer: [
        new EsbuildPlugin({
          target: 'es2022',
          treeShaking: true,
        }),
      ],
      moduleIds: 'deterministic',
      chunkIds: 'named',
      splitChunks: {
        chunks: 'async',
        minSize: 69000,
        minChunks: 2,
      },
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new Dotenv({
        path: path.resolve(__dirname, '../../.env'),
        safe:
          process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../../.env.example') : false,
        systemvars: true,
      }),
      new EsbuildPlugin({
        define: {
          __DEV__: JSON.stringify(!isProduction),
          'globalThis.__DEV__': JSON.stringify(!isProduction),
        },
      }),
      new webpack.ProgressPlugin({
        entries: true,
        modules: true,
        modulesCount: 100,
        profile: true,
      }),
      new webpack.AutomaticPrefetchPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process'],
      }),
      new InjectManifest({
        swSrc: './src/sw',
        swDest: path.resolve(__dirname, '../../dist/', 'sw.js'),
        exclude: [/\.map$/, /^manifest.*\.js$/, /\.d.ts$/, /\.ts$/],
      }),
      new SubresourceIntegrityPlugin({
        enabled: false, // disable until fixed isProduction,
      }),
      new WebpackAssetsManifest({ integrity: true }),
    ],
    devtool: process.env.NODE_ENV === 'production' ? undefined : 'eval-cheap-module-source-map',
    mode: process.env.NODE_ENV || 'development',
    externals: [
      function({ request }, callback) {
        if (/^rxjs\/operators$/.test(request)) {
          return callback(null, ['rxjs', 'operators'], 'root');
        }
        if (/^rxjs$/.test(request)) {
          return callback(null, 'rxjs', 'root');
        }
        if (/^single-spa-react$/.test(request)) {
          return callback(null, 'singleSpaReact', 'root');
        }
        if (/^single-spa$/.test(request)) {
          return callback(null, 'singleSpa', 'root');
        }
        callback();
      },
    ],
  },
  {
    entry: path.join(__dirname, 'src', 'worker.mjs'),
    output: {
      path: path.resolve(__dirname, '../../dist/'),
      filename: 'worker.js',
    },
    target: 'webworker',
  },
];

export default config;
