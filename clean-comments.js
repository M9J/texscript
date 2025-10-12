#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import stripPkg from "strip-comments";

const strip = stripPkg.default ?? stripPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, ".", "src-lib", "v3");
const EXT_WHITELIST = new Set([
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".css",
  ".scss",
  ".less",
  ".html",
  ".htm",
]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === "node_modules" || e.name.startsWith(".git")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else {
      const ext = path.extname(e.name).toLowerCase();
      if (!EXT_WHITELIST.has(ext)) continue;
      try {
        const src = await fs.readFile(full, "utf8");
        const out = strip(src);
        if (out !== src) await fs.writeFile(full, out, "utf8");
        console.log("Processed:", full);
      } catch (err) {
        console.error("Failed:", full, err.message);
      }
    }
  }
}

walk(ROOT).catch((err) => {
  console.error(err);
  process.exit(1);
});