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
  entryPoints: ["lib/v1/texscript.js"],
  outfile: "build/v1/texscript.js",
  bundle: false,
  minify: true,
});

const build2 = esbuild.build({
  ...common,
  entryPoints: ["lib/v1/splash.js"],
  outfile: "build/v1/splash.js",
  bundle: false,
  minify: true,
});

const buildLib = esbuild.build({
  ...common,
  entryPoints: ["lib/v1/lib/loader.js"],
  bundle: true,
  minify: true,
  splitting: true,
  outdir: "build/v1/lib",
  chunkNames: "chunks/[name]-[hash]",
  assetNames: "assets/[name]-[hash]",
});

const buildCss = esbuild.build({
  entryPoints: ["lib/v1/css/styles.css"],
  outfile: "build/v1/styles.css",
  bundle: true,
  minify: true,
  loader: { ".css": "css" },
  sourcemap: false,
  legalComments: "none",
});

Promise.all([build1, build2, buildLib, buildCss])
  .then(() => {
    console.log("Production build complete");
  })
  .catch(() => process.exit(1));
