const path = require("path");
const tsc = require("typescript");
const tsConfig = require("../tsconfig.json");

module.exports = {
  process(src, fullPath) {
    if (path.extname(fullPath) === ".ts") {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    return src;
  }
};
