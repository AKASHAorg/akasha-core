const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const name = require("./package.json").name;

const { InjectManifest } = require("workbox-webpack-plugin");

const config = {
  entry: "./src/index.ts",
  context: path.resolve(__dirname),
  module: {
    rules: [{ test: /\.ts(x)?$/, loader: "ts-loader" },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "*.mjs"],
    alias: {
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser")
    },
    fallback: {
      os: false,
      crypto: false,
      http: false,
      https: false,
      dns: false,
      fs: false,
      assert: require.resolve("assert/"),
      path: require.resolve("path-browserify/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    }
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "akasha.sdk.js",
    library: name.replace(/@/, "").replace(/\//, "__").replace(/-/, "_"),
    libraryTarget: "umd",
    publicPath: "/"
  },
  optimization: {
    moduleIds: "deterministic"
  },
  plugins: [
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
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: ["process"]
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../../examples/ui/feed-app/public/template-index.html"),
      inject: true
    }),
    new InjectManifest({
      swSrc: "./lib/sw.js",
      swDest: "sw.js",
      exclude: [/.*?/]
    })
  ],
  devtool: "source-map",
  mode: process.env.NODE_ENV || "development",
  externals: [
    {
      "single-spa-react": "singleSpaReact",
      "rxjs": "rxjs"
    }
  ]
};

module.exports = config;
