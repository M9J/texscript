import express from "express";
import serveIndex from "serve-index";
import { poppinsRGB } from "../utils/poppins.js";

const app = express();
const PORT = 80;

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Access] ${req.method} ${req.url}`);
  next();
});

const PATHS = {
  "/": "./src-testing/",
  "/devBuild": "./.temp/build/",
  "/prodBuild": "./build/",
  "/releases": "./releases/",
};

function createEndpointsAndIndexing(paths) {
  for (const path in paths) {
    const dir = paths[path];
    app.use(
      path,
      express.static(dir, {
        setHeaders: (res, filePath) => {
          console.log(`[Serving ${path}] File: ${filePath}`);
        },
      })
    );
    app.use(path, serveIndex(dir, { icons: true }));
  }
}

createEndpointsAndIndexing(PATHS);

app.listen(PORT, () => {
  const white = poppinsRGB(255, 255, 255);
  const link = `http://localhost:${PORT}`
  console.log(`Server running at ${white(link)}`);
  const formatted = Object.entries(PATHS).map(([Route, Directory]) => ({ Route, Directory }));
  console.table(formatted);
});
