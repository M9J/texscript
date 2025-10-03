import path from "path";
import CopyPlugin from "copy-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.bundle.js",
    path: path.resolve("./dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src", to: "" },
      ],
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.resolve(process.cwd(), "dist"),
        publicPath: "/", // served at root
      },
      {
        directory: path.resolve(process.cwd(), ".temp/devBuild/texscript"),
        publicPath: "/devBuild",
      },
    ],
    hot: true,
    devMiddleware: {
      writeToDisk: false,
    },
  },
};
