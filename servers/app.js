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

// Serve and index build
app.use(
  "/devBuild",
  express.static(".temp/build/", {
    setHeaders: (res, filePath) => {
      console.log(`[Serving /devBuild] File: ${filePath}`);
    },
  })
);
app.use("/devBuild", serveIndex(".temp/build/", { icons: true }));

// Serve and index build
app.use(
  "/prodBuild",
  express.static("build/", {
    setHeaders: (res, filePath) => {
      console.log(`[Serving /prodBuild] File: ${filePath}`);
    },
  })
);
app.use("/prodBuild", serveIndex("build/", { icons: true }));

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
    "/": "./examples/",
    "/devBuild": "./.temp/build/",
    "/prodBuild": "./build/",
    "/releases": "./releases/",
  };
  const formatted = Object.entries(paths).map(([Route, Directory]) => ({ Route, Directory }));
  console.table(formatted);
});
