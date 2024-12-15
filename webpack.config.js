const path = require("path");

module.exports = {
  entry: "./src/js/texscript.js",
  output: {
    filename: "texscript.bundle.js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
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
    ],
  },
};
