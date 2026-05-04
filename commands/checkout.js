const fs = require("fs");
const path = require("path");

const { getCurrentBranch } = require("../utils/branch");
const hasChangesFromCommit = require("../utils/hasChangesFromCommit");

function checkoutCommand(branch, options) {

  const repoPath = path.join(process.cwd(), ".vc");

  if (!fs.existsSync(repoPath)) {
    console.log("Not a vc repository.");
    return;
  }

  const headsPath = path.join(repoPath, "refs", "heads");
  const branchPath = path.join(headsPath, branch);

  // ---------- BLOCK CHECKOUT IF UNCOMMITTED CHANGES ----------

  if (hasChangesFromCommit(repoPath)) {

    console.log(
      "Please commit current changes before checking out."
    );

    return;
  }

  // ---------- CREATE BRANCH ----------

  if (options.create) {

    if (fs.existsSync(branchPath)) {
      console.log("Branch already exists.");
      return;
    }

    const currentBranch = getCurrentBranch(repoPath);

    const currentCommit = fs
      .readFileSync(path.join(headsPath, currentBranch), "utf8")
      .trim();

    fs.writeFileSync(branchPath, currentCommit);

    console.log(`Branch ${branch} created.`);
  }

  if (!fs.existsSync(branchPath)) {
    console.log("Branch does not exist.");
    return;
  }

  const commitHash = fs.readFileSync(branchPath, "utf8").trim();

  // ---------- SWITCH HEAD ----------

  const headPath = path.join(repoPath, "HEAD");

  fs.writeFileSync(headPath, `ref: refs/heads/${branch}`);

  // ---------- RESTORE FILES ----------

  if (!commitHash) {
    console.log(`Switched to branch ${branch}`);
    return;
  }

  const commitPath = path.join(repoPath, "commits", commitHash );

  if (!fs.existsSync(commitPath)) {
    console.log("Commit not found.");
    return;
  }

  const commit = JSON.parse(fs.readFileSync(commitPath));

  const files = commit.files || {};

  const objectsPath = path.join(repoPath, "objects");

  const workingFiles = fs.readdirSync(process.cwd());

  for (const file of workingFiles) {

    if (file === ".vc") continue;
    if (file === ".vcignore") continue;

    const fullPath = path.join(process.cwd(), file);

    if (fs.statSync(fullPath).isFile()) {
      fs.unlinkSync(fullPath);
    }
  }

  for (const file in files) {

    const objectPath = path.join(objectsPath, files[file]);

    if (!fs.existsSync(objectPath)) continue;

    const content = fs.readFileSync(objectPath, "utf8");

    fs.writeFileSync(path.join(process.cwd(), file), content);
  }

  console.log(`Switched to branch ${branch}`);
}

module.exports = checkoutCommand;