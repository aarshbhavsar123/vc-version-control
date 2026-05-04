const fs = require("fs");
const path = require("path");

function rmCommand(file) {

  const repoPath = path.join(process.cwd(), ".vc");

  const indexPath = path.join(repoPath, "index");

  let index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  if (!index[file]) {
    console.log("File not staged.");
    return;
  }

  delete index[file];

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.log(`${file} removed from staging`);

}

module.exports = rmCommand;