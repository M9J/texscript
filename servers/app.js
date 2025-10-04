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
  console.log(`./examples -> /`);
  console.log(`./.temp/devBuild/texscript -> /devBuild`);
  console.log(`./releases -> /releases`);
});
