import express from "express";
import serveIndex from "serve-index";

const app = express();
const PORT = 8080;

app.use("/", express.static("examples"));
app.use("/", serveIndex("examples", { icons: true }));

app.use("/devBuild", express.static(".temp/devBuild/texscript"));
app.use("/devBuild", serveIndex(".temp/devBuild/texscript", { icons: true }));

app.use("/releases", express.static("releases"));

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
