import esbuild from "esbuild";

const common = {
  platform: "browser",
  target: ["es2018"],
  format: "esm",
  tsconfig: "tsconfig.json",
  external: [],
  legalComments: "none",
  sourcemap: "inline",
  minify: false,
  logLevel: "info",
  define: { "process.env.NODE_ENV": '"development"' },
};

const build1 = () =>
  esbuild
    .build({
      ...common,
      entryPoints: ["lib/v2/texscript.ts"],
      outfile: "./.temp/build/v2/texscript.js",
      bundle: false,
    })
    .then(() => {
      console.log("v2 dev build complete");
    });

const buildLib = () =>
  esbuild
    .build({
      ...common,
      entryPoints: ["lib/v2/texscript.lib.ts"],
      outfile: "./.temp/build/v2/texscript.lib.js",
      bundle: true,
    })
    .then(() => {
      console.log("v2-lib dev build complete");
    });

const buildCss = () =>
  esbuild.build({
    entryPoints: ["lib/v2/css/texscript.css"],
    outfile: "./.temp/build/v2/texscript.css",
    bundle: true,
    minify: false,
    loader: { ".css": "css" },
    sourcemap: "inline",
    legalComments: "none",
    logLevel: "info",
    define: { "process.env.NODE_ENV": '"development"' },
  });

export async function runDevBundle() {
  await Promise.all([build1(), buildLib(), buildCss()])
    .then(() => {
      console.log("Development build complete");
    })
    .catch(() => process.exit(1));
}
