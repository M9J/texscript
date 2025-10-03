import { merge } from "webpack-merge";

import bundle from "./webpack-bundle.config.js";
import copy from "./webpack-copy.config.js";
import minify from "./webpack-minify.config.js";

export default (env = {}) => {
  return merge(minify(env), bundle(env), copy(env));
};
