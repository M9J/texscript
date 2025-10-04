import express from "express";
import serveIndex from "serve-index";

const app = express();
const PORT = 8080;

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Access] ${req.method} ${req.url}`);
  next();
});

// Serve and index examples
app.use(
  "/",
  express.static("examples", {
    setHeaders: (res, filePath) => {
      console.log(`[Serving /] File: ${filePath}`);
    },
  })
);
app.use("/", serveIndex("examples", { icons: true }));

// Serve and index devBuild
app.use(
  "/devBuild",
  express.static(".temp/devBuild/texscript", {
    setHeaders: (res, filePath) => {
      console.log(`[Serving /devBuild] File: ${filePath}`);
    },
  })
);
app.use("/devBuild", serveIndex(".temp/devBuild/texscript", { icons: true }));

// Serve releases
app.use(
  "/releases",
  express.static("releases", {
    setHeaders: (res, filePath) => {
      console.log(`[Serving /releases] File: ${filePath}`);
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  const paths = {
    "./examples": "/",
    "./.temp/devBuild/texscript": "/devBuild",
    "./releases": "/releases",
  };
  const formatted = Object.entries(paths).map(([Path, Route]) => ({ Path, Route }));
  console.table(formatted);
});
