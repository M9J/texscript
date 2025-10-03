import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import IgnoreEmitPlugin from "ignore-emit-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

const __dirname = process.cwd();

export default (env = {}) => {
  const buildDir = env.outputDir === "build" ? "build" : ".temp/devBuild";
  const isProd = env.mode === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: {
      styles: path.resolve(__dirname, "lib/v1/css/styles.css"), // Your main CSS file
    },
    output: {
      path: path.resolve(__dirname, `./${buildDir}/texscript/v1`),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css", // Final bundled CSS file
      }),
      new IgnoreEmitPlugin(["styles.js"]),
    ],
    devtool: isProd ? false : "eval-source-map",
    optimization: {
      minimize: isProd,
      minimizer: isProd ? [new CssMinimizerPlugin()] : [],
      splitChunks: false,
      runtimeChunk: false,
    },
    experiments: {
      outputModule: false,
    },
    resolve: {
      extensions: [".css"], // Resolve only CSS files
    },
  };
};
