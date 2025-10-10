import esbuild from "esbuild";
import { cleanCssPlugin } from "./plugins/clean-css.plugin.js";

const common = {
  platform: "browser",
  target: ["es2018"],
  format: "iife",
  tsconfig: "tsconfig.json",
  external: [],
  legalComments: "none",
  minify: true,
};

const build1 = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v3/texscript.ts"],
  outfile: "build/v3/texscript.js",
  bundle: true,
  loader: {
    ".css": "text",
  },
  plugins: [cleanCssPlugin],
});

await Promise.all([build1])
  .then(() => {
    console.log("Production build complete");
  })
  .catch(() => process.exit(1));
