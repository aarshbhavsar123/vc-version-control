const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function commitCommand(options) {

  const repoPath = path.join(process.cwd(), ".vc");

  if (!fs.existsSync(repoPath)) {
    console.log("Not a vc repository. Run 'vc init' first.");
    return;
  }

  const indexPath = path.join(repoPath, "index");

  if (!fs.existsSync(indexPath)) {
    console.log("Nothing to commit.");
    return;
  }

  const stagedFiles = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  if (Object.keys(stagedFiles).length === 0) {
    console.log("Nothing to commit.");
    return;
  }

  if (!options.message) {
    console.log("Commit message required. Use -m \"message\"");
    return;
  }

  // ---------- GET CURRENT BRANCH ----------

  const headPath = path.join(repoPath, "HEAD");

  const headContent = fs.readFileSync(headPath, "utf-8").trim();

  const branch = headContent.replace("ref: refs/heads/", "");

  const branchPath = path.join(repoPath, "refs", "heads", branch);

  // ---------- GET PARENT COMMIT ----------

  let parent = null;

  if (fs.existsSync(branchPath)) {

    const parentCommit = fs.readFileSync(branchPath, "utf-8").trim();

    if (parentCommit !== "") {
      parent = parentCommit;
    }

  }

  // ---------- CREATE COMMIT OBJECT ----------

  const commitData = {
    parent: parent,
    message: options.message,
    timestamp: Date.now(),
    files: stagedFiles
  };

  const commitString = JSON.stringify(commitData);

  const commitHash = crypto
    .createHash("sha1")
    .update(commitString)
    .digest("hex");

  const commitPath = path.join(repoPath, "commits", commitHash);

  fs.writeFileSync(commitPath, JSON.stringify(commitData, null, 2));

  // ---------- UPDATE BRANCH POINTER ----------

  fs.writeFileSync(branchPath, commitHash);

  // ---------- CLEAR STAGING ----------

  fs.writeFileSync(indexPath, "{}");

  console.log(`Committed to ${branch} as ${commitHash}`);

}

module.exports = commitCommand;