import fs from "fs/promises";

export const cleanCssPlugin = {
  name: "clean-css",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      let css = await fs.readFile(args.path, "utf8");

      css = css
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
        .replace(/[\r\n]+/g, "") // Remove all newlines and carriage returns
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .trim(); // Trim leading/trailing spaces

      return {
        contents: css,
        loader: "text",
      };
    });
  },
};
