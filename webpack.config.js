const path = require("path");

module.exports = {
  entry: "./src/js/texscript.js",
  output: {
    filename: "texscript.bundle.js",
    path: path.resolve(__dirname, "dist"),
  chunkFilename: "[name].bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, ""),
      watch: true,
    },
    compress: true,
    port: 9000,
    hot: true,
    watchFiles: ["src/**/*.js", "src/**/*.css", "dist/**/*.js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
