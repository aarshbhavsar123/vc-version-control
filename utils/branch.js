const fs = require("fs");
const path = require("path");

function getCurrentBranch(repoPath) {

  const headPath = path.join(repoPath, "HEAD");

  const headContent = fs.readFileSync(headPath, "utf-8").trim();

  return headContent.replace("ref: refs/heads/", "");
}

function getBranchCommit(repoPath, branch) {

  const branchPath = path.join(repoPath, "refs", "heads", branch);

  if (!fs.existsSync(branchPath)) return null;

  return fs.readFileSync(branchPath, "utf-8").trim();
}

module.exports = {
  getCurrentBranch,
  getBranchCommit
};