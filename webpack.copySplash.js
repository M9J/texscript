const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {},
  output: {
    path: path.resolve(__dirname, "dist/splash"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "src/js/splash/texscript.splash.js", to: "texscript.splash.js" }],
    }),
  ],
};
