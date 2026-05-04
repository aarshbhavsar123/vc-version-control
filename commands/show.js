const fs = require("fs");
const path = require("path");

function showCommand(commitHash) {

  const repoPath = path.join(process.cwd(), ".vc");

  const commitPath = path.join(repoPath, "commits", commitHash);

  if (!fs.existsSync(commitPath)) {
    console.log("Commit not found.");
    return;
  }

  const commit = JSON.parse(fs.readFileSync(commitPath, "utf-8"));

  console.log(`Commit: ${commitHash}`);
  console.log(`Message: ${commit.message}`);
  console.log(`Parent: ${commit.parent}`);
  console.log(`Time: ${new Date(commit.timestamp)}`);

  console.log("\nFiles:");

  for (const file in commit.files) {
    console.log(file);
  }

}

module.exports = showCommand;