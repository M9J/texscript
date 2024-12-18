const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");

module.exports = {
  entry: "./src/js/lib/css/texscript.css",
  output: {
    filename: "texscript.css.dummy",
    path: path.resolve(__dirname, "dist/lib/css"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "texscript.css",
    }),
    new IgnoreEmitPlugin(["texscript.css.dummy"]), // Ignore the emission of the dummy JS file
  ],
  mode: "production",
  optimization: {
    // Disable Webpack's default JS file creation
    splitChunks: false,
    runtimeChunk: false,
  },
  performance: {
    // Turn off performance hints as we're not working with JS
    hints: false,
  },
  stats: {
    // Don't output any information about the dummy JS file
    all: false,
  },
  resolve: {
    extensions: [".css"], // Resolve only CSS files
  },
};
