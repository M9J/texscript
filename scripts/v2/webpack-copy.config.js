import path from "path";
import TerserPlugin from "terser-webpack-plugin";

const __dirname = process.cwd();

export default (env = {}) => {
  const buildDir = env.outputDir === "build" ? "build" : ".temp/devBuild";
  const isProd = env.mode === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: {
      texscript: path.resolve(__dirname, "lib/v2/texscript.ts"),
      splash: path.resolve(__dirname, "lib/v2/splash.ts"),
    },
    output: {
      filename: "[name].js", // Will output texscript.js and splash.js
      path: path.resolve(__dirname, `./${buildDir}/texscript/v2`),
      clean: true,
    },
    devtool: isProd ? false : "eval-source-map",
    optimization: {
      minimize: isProd,
      minimizer: isProd ? [new TerserPlugin()] : [],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
        },
      ],
    },
  };
};
