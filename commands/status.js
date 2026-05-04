const fs = require("fs");
const path = require("path");

function statusCommand() {

  const repoPath = path.join(process.cwd(), ".vc");

  if (!fs.existsSync(repoPath)) {
    console.log("Not a vc repository.");
    return;
  }

  const headPath = path.join(repoPath, "HEAD");
  const headContent = fs.readFileSync(headPath, "utf-8").trim();

  const branch = headContent.replace("ref: refs/heads/", "");

  console.log(`On branch ${branch}\n`);

  const indexPath = path.join(repoPath, "index");

  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  console.log("Staged files:");

  if (Object.keys(index).length === 0) {
    console.log("  (none)");
  }

  for (const file in index) {
    console.log(" ", file);
  }

}

module.exports = statusCommand;