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

const buildLib = () =>
  esbuild.build({
    ...common,
    entryPoints: ["src-lib/v3/texscript.lib.ts"],
    outfile: "./.temp/build/v3/texscript.lib.js",
    bundle: true,
    loader: {
      ".css": "text",
    },
  });

export async function runDevBundle() {
  await Promise.all([build1(), buildLib()])
    .then(() => {
      console.log("Development build complete");
    })
    .catch(() => process.exit(1));
}
