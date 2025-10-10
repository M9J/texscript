import express from "express";
import serveIndex from "serve-index";

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
  console.log(`Server running at http://localhost:${PORT}`);
  const formatted = Object.entries(PATHS).map(([Route, Directory]) => ({ Route, Directory }));
  console.table(formatted);
});
