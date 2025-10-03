import path from "path";
import TerserPlugin from "terser-webpack-plugin";

const __dirname = process.cwd();

export default (env = {}) => {
  const buildDir = env.outputDir === "build" ? "build" : ".temp/devBuild";
  const isProd = env.mode === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: {
      texscript: path.resolve(__dirname, "lib/v1/texscript.js"),
      splash: path.resolve(__dirname, "lib/v1/splash.js"),
    },
    output: {
      filename: "[name].js", // Will output texscript.js and splash.js
      path: path.resolve(__dirname, `./${buildDir}/texscript/v1`),
      clean: true,
    },
    devtool: isProd ? false : "eval-source-map",
    optimization: {
      minimize: isProd,
      minimizer: isProd ? [new TerserPlugin()] : [],
    },
  };
};
