import path from "path";
import TerserPlugin from "terser-webpack-plugin";

const __dirname = process.cwd();

export default (env = {}) => {
  const buildDir = env.outputDir === "build" ? "build" : ".temp/devBuild";
  const isProd = env.mode === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: {
      "lib/loader": path.resolve(__dirname, "lib/v2/lib/loader.ts"), // Adjust path if needed
    },
    output: {
      filename: "[name].js", // Entry point output
      chunkFilename: "lib/[name].js", // Dynamic chunks
      path: path.resolve(__dirname, `./${buildDir}/texscript/v2`), // Output directory
      clean: true, // Clean output dir before build
      library: {
        type: "module", // Output as ES modules
      },
    },
    devtool: isProd ? false : "eval-source-map",
    experiments: {
      outputModule: true, // Enable ES module output
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, "src"), // Adjust to your source folder
          use: "babel-loader", // Transpile modern JS
        },
      ],
    },
    optimization: {
      minimize: isProd,
      minimizer: isProd ? [new TerserPlugin()] : [],
      splitChunks: {
        chunks: "all", // Split vendor and shared code
      },
    },
    resolve: {
      extensions: [".js"], // Resolve JS files
    },
  };
};
