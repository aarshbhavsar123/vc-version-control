    const fs = require("fs");
const path = require("path");
const { getCurrentBranch } = require("../utils/branch");

function stagedDiffCommand() {

  const repoPath = path.join(process.cwd(), ".vc");
  const indexPath = path.join(repoPath, "index");
  const objectsPath = path.join(repoPath, "objects");

  if (!fs.existsSync(indexPath)) {
    console.log("Nothing staged.");
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath));

  const currentBranch = getCurrentBranch(repoPath);
  const branchPath = path.join(repoPath, "refs", "heads", currentBranch);

  let commitFiles = {};

  if (fs.existsSync(branchPath)) {

    const commitHash = fs.readFileSync(branchPath, "utf8").trim();

    if (commitHash) {

      const commitPath = path.join(repoPath, "commits", commitHash + ".json");

      if (fs.existsSync(commitPath)) {

        const commit = JSON.parse(fs.readFileSync(commitPath));

        commitFiles = commit.files || {};
      }
    }
  }

  const allFiles = new Set([
    ...Object.keys(index),
    ...Object.keys(commitFiles)
  ]);

  for (const file of allFiles) {

    const stagedHash = index[file];
    const commitHash = commitFiles[file];

    if (stagedHash === commitHash) continue;

    console.log(`\nDiff for ${file}`);

    let stagedContent = [];
    let commitContent = [];

    if (stagedHash) {

      const stagedPath = path.join(objectsPath, stagedHash);

      stagedContent = fs.readFileSync(stagedPath, "utf8").split("\n");
    }

    if (commitHash) {

      const commitPath = path.join(objectsPath, commitHash);

      commitContent = fs.readFileSync(commitPath, "utf8").split("\n");
    }

    const maxLines = Math.max(stagedContent.length, commitContent.length);

    for (let i = 0; i < maxLines; i++) {

      const oldLine = commitContent[i];
      const newLine = stagedContent[i];

      if (oldLine === newLine) continue;

      if (oldLine !== undefined) {
        console.log("\x1b[31m- " + oldLine + "\x1b[0m");
      }

      if (newLine !== undefined) {
        console.log("\x1b[32m+ " + newLine + "\x1b[0m");
      }
    }
  }
}

module.exports = stagedDiffCommand;