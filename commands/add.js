const fs = require("fs");
const path = require("path");

const generateHash = require("../utils/hash");
const { loadIgnoreRules, shouldIgnore } = require("../utils/ignore");

function addCommand(paths) {

  const repoPath = path.join(process.cwd(), ".vc");

  if (!fs.existsSync(repoPath)) {
    console.log("Not a vc repository. Run 'vc init' first.");
    return;
  }

  const ignoreRules = loadIgnoreRules();

  const indexPath = path.join(repoPath, "index");

  let index = {};

  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath));
  }

  function processFile(filePath) {

    const relativePath = path.relative(process.cwd(), filePath);

    if (shouldIgnore(relativePath, ignoreRules)) {
      return;
    }

    const content = fs.readFileSync(filePath);

    const hash = generateHash(content);

    const objectPath = path.join(repoPath, "objects", hash);

    if (!fs.existsSync(objectPath)) {
      fs.writeFileSync(objectPath, content);
    }

    index[relativePath] = hash;

    console.log(`Added ${relativePath}`);
  }

  function walkDirectory(dirPath) {

    const files = fs.readdirSync(dirPath);

    for (const file of files) {

      if (file === ".vc") continue;

      const fullPath = path.join(dirPath, file);

      const stats = fs.statSync(fullPath);

      const relativePath = path.relative(process.cwd(), fullPath);

      if (shouldIgnore(relativePath, ignoreRules)) {
        continue;
      }

      if (stats.isDirectory()) {
        walkDirectory(fullPath);
      } else {
        processFile(fullPath);
      }
    }
  }

  for (const p of paths) {

    const absolutePath = path.join(process.cwd(), p);

    if (!fs.existsSync(absolutePath)) {
      console.log(`Path not found: ${p}`);
      continue;
    }

    const stats = fs.statSync(absolutePath);

    if (stats.isDirectory()) {
      walkDirectory(absolutePath);
    } else {
      processFile(absolutePath);
    }
  }

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

module.exports = addCommand;