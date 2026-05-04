const fs = require("fs");
const path = require("path");

function logCommand() {

  const repoPath = path.join(process.cwd(), ".vc");

  const headPath = path.join(repoPath, "HEAD");

  const headContent = fs.readFileSync(headPath, "utf-8").trim();

  const branch = headContent.replace("ref: refs/heads/", "");

  const branchPath = path.join(repoPath, "refs", "heads", branch);

  let commitHash = fs.readFileSync(branchPath, "utf-8").trim();

  while (commitHash) {

    const commitPath = path.join(repoPath, "commits", commitHash);

    const commit = JSON.parse(fs.readFileSync(commitPath, "utf-8"));

    console.log(`commit ${commitHash}`);
    console.log(`Message: ${commit.message}`);
    console.log(`Time: ${new Date(commit.timestamp)}`);
    console.log("");

    commitHash = commit.parent;

  }

}

module.exports = logCommand;