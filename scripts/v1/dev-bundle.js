import esbuild from "esbuild";

const common = {
  platform: "browser",
  target: ["es2018"],
  format: "esm",
  tsconfig: "tsconfig.json",
  external: [],
  legalComments: "none",
  minify: false,
  sourcemap: "inline",
  logLevel: "info",
  define: { "process.env.NODE_ENV": '"development"' },
};

const build1 = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v1/texscript.js"],
  outfile: ".temp/build/v1/texscript.js",
  bundle: false,
});

const build2 = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v1/splash.js"],
  outfile: ".temp/build/v1/splash.js",
  bundle: false,
});

const buildLib = esbuild.build({
  ...common,
  entryPoints: ["src-lib/v1/lib/loader.js"],
  outfile: ".temp/build/v1/lib/loader.js",
  bundle: true,
});

const buildCss = esbuild.build({
  entryPoints: ["src-lib/v1/css/styles.css"],
  outfile: "./.temp/build/v1/styles.css",
  bundle: true,
  minify: false,
  loader: { ".css": "css" },
  sourcemap: "inline",
  legalComments: "none",
  logLevel: "info",
  define: { "process.env.NODE_ENV": '"development"' },
});

Promise.all([build1, build2, buildLib, buildCss])
  .then(() => {
    console.log("Development build complete");
  })
  .catch(() => process.exit(1));
