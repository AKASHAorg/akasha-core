const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const name = require("./package.json").name;

const { InjectManifest } = require("workbox-webpack-plugin");

const config = {
  entry: "./src/index.ts",
  context: path.resolve(__dirname),
  module: {
    rules: [{
      test: /\.ts(x)?$/,
      loader: "ts-loader",
      options: {
        transpileOnly: true
      } },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "*.mjs"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "akasha.sdk.js",
    library: name.replace(/@/, "").replace(/\//, "__").replace(/-/, "_"),
    libraryTarget: "umd",
    publicPath: "/"
  },
  target: ['web', 'es2017'],
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "named",
    splitChunks: {
      chunks: 'all',
      minSize: 69000,
      minChunks: 2,
    }
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.EnvironmentPlugin({
      GRAPHQL_URI: process.env.GRAPHQL_URI || "https://api.akasha.network/graphql",
      NODE_ENV: process.env.NODE_ENV || "development",
      AUTH_ENDPOINT: process.env.AUTH_ENDPOINT || "wss://api.akasha.network/ws/userauth"
    }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true
    }),
    new webpack.AutomaticPrefetchPlugin(),
    new InjectManifest({
      swSrc: "./lib/sw.js",
      swDest: "sw.js",
      exclude: [/.*?/]
    })
  ],
  devtool: process.env.NODE_ENV === "production" ? 'source-map' : 'inline-source-map',
  mode: process.env.NODE_ENV || "development",
  externals: [
    {
//      "single-spa-react": "singleSpaReact",
      "rxjs": "rxjs"
    }
  ]
};

module.exports = config;
