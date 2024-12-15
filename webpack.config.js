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
    watchFiles: [
      "src/**/*.js", // Watch all JS files in the src directory
      "src/**/*.css", // Watch all CSS files in the src directory
      "public/**/*.html", // Watch all HTML files in the public directory
    ],
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
