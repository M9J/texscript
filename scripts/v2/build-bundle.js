import esbuild from "esbuild";

const common = {
  platform: "browser",
  target: ["es2018"],
  format: "esm",
  tsconfig: "tsconfig.json",
  external: [],
  legalComments: "none",
  minify: true,
};

const build1 = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v2/texscript.ts"],
  outfile: "build/v2/texscript.js",
  bundle: false,
});

const build2 = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v2/texscript.lib.ts"],
  outfile: "build/v2/texscript.lib.js",
  bundle: false,
});

const buildLib = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v2/lib/splash.ts"],
  outdir: "build/v2/lib/",
  bundle: true,
  splitting: true,
  preserveSymlinks: true,
});

const buildCss = esbuild.build({
  entryPoints: ["src-lib/v2/css/texscript.css"],
  outfile: "build/v2/texscript.css",
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

const buildMin = esbuild.build({
  platform: "browser",
  target: ["es2018"],
  format: "iife",
  tsconfig: "tsconfig.json",
  external: [],
  legalComments: "none",
  minify: true,
  entryPoints: ["src-lib/v2/texscript.ts"],
  outfile: "build/min/v2/texscript.js",
  bundle: true,
});


const buildMinCss = esbuild.build({
  entryPoints: ["src-lib/v2/css/texscript.css"],
  outfile: "build/min/v2/texscript.css",
  bundle: true,
  minify: true,
  loader: { ".css": "css" },
  sourcemap: false,
  legalComments: "none",
});

Promise.all([buildMin, buildMinCss])
  .then(() => {
    console.log("Production min build complete");
  })
  .catch(() => process.exit(1));
