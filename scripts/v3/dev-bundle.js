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
  esbuild.build({
    ...common,
    entryPoints: ["src-lib/v3/texscript.ts"],
    outfile: "./.temp/build/v3/texscript.js",
    bundle: false,
  });

const build2 = () =>
  esbuild.build({
    ...common,
    entryPoints: ["src-lib/v3/texscript.lib.ts"],
    outfile: "./.temp/build/v3/texscript.lib.js",
    bundle: false,
  });

const buildLib = () =>
  esbuild.build({
    ...common,
    entryPoints: ["src-lib/v3/lib/splash.ts"],
    outdir: "./.temp/build/v3/lib/",
    bundle: true,
    splitting: true,
    preserveSymlinks: true,
  });

const buildCss = () =>
  esbuild.build({
    ...common,
    entryPoints: ["src-lib/v3/css/texscript.css"],
    outfile: "./.temp/build/v3/texscript.css",
    bundle: true,
    loader: { ".css": "css" },
  });

export async function runDevBundle() {
  await Promise.all([build1(), build2(), buildLib(), buildCss()])
    .then(() => {
      console.log("Development build complete");
    })
    .catch(() => process.exit(1));
}
