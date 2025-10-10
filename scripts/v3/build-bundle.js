import esbuild from "esbuild";
import { cleanCssPlugin } from "./plugins/clean-css.plugin.js";
import fs from "fs";
import { minify } from "terser";

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
    console.log("Production build bundle generated");
  })
  .catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });

const code = fs.readFileSync("build/v3/texscript.js", "utf8");

const result = await minify(code, {
  compress: true,
  mangle: true,
  ecma: 2018,
  toplevel: true,
});

fs.mkdirSync("build/v3", { recursive: true });
fs.writeFileSync("build/v3/texscript.min.js", result.code);

console.log("Build and post-process complete.");
