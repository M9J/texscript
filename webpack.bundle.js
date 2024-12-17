const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "texscript.loader": "./src/js/lib/texscript.loader.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/lib"),
    library: {
      type: "module", // Ensure the output is an ES module
    },
  },
  experiments: {
    outputModule: true, // Enable Webpack to output ES modules
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src/js/lib"),
        use: "babel-loader",
      },
    ],
  },
};
