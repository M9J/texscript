import esbuild from "esbuild";

const common = {
  platform: "browser",
  target: ["es2018"],
  format: "esm",
  tsconfig: "tsconfig.json",
  external: [],
  legalComments: "none",
};

const build1 = esbuild.build({
  ...common,
  entryPoints: ["lib/v2/texscript.ts"],
  outfile: "build/v2/texscript.js",
  bundle: false,
  minify: true,
});

const buildLib = esbuild.build({
  ...common,
  entryPoints: ["lib/v2/texscript.lib.ts"],
  outfile: "build/v2/texscript.lib.js",
  bundle: true,
  minify: true,
});

const buildCss = esbuild.build({
  entryPoints: ["lib/v2/css/texscript.css"],
  outfile: "build/v2/texscript.css",
  bundle: true,
  minify: true,
  loader: { ".css": "css" },
  sourcemap: false,
  legalComments: "none",
});

Promise.all([build1, buildLib, buildCss])
  .then(() => {
    console.log("Production build complete");
  })
  .catch(() => process.exit(1));
