const fs = require("fs");
const path = require("path");

function lsFilesCommand() {

  const repoPath = path.join(process.cwd(), ".vc");

  const indexPath = path.join(repoPath, "index");

  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  for (const file in index) {
    console.log(file);
  }

}

module.exports = lsFilesCommand;