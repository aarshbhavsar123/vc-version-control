const fs = require("fs");
const path = require("path");
const { getCurrentBranch } = require("./branch");

function getIgnoredFiles() {
  const ignorePath = path.join(process.cwd(), ".vcignore");

  if (!fs.existsSync(ignorePath)) return new Set();

  const lines = fs
    .readFileSync(ignorePath, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return new Set(lines);
}

function hasChangesFromCommit(repoPath) {
  const ignoredFiles = getIgnoredFiles();
  const branch = getCurrentBranch(repoPath);
  const branchFile = path.join(repoPath, "refs", "heads", branch);

  if (!fs.existsSync(branchFile)) return false;

  const commitHash = fs.readFileSync(branchFile, "utf8").trim();

  if (!commitHash) return false;

  const commitPath = path.join(repoPath, "commits", commitHash );

  if (!fs.existsSync(commitPath)) return false;

  const commit = JSON.parse(fs.readFileSync(commitPath));

  const commitFiles = commit.files || {};

  const objectsPath = path.join(repoPath, "objects");

  // ---------- CHECK MODIFIED OR DELETED FILES ----------

  for (const file in commitFiles) {
    if (ignoredFiles.has(file)) continue;

    const workingFile = path.join(process.cwd(), file);

    const objectFile = path.join(objectsPath, commitFiles[file]);

    const commitContent = fs.readFileSync(objectFile, "utf8");

    if (!fs.existsSync(workingFile)) {
      return true;
    }

    const workingContent = fs.readFileSync(workingFile, "utf8");

    if (workingContent !== commitContent) {
      return true;
    }
  }

  // ---------- CHECK NEW FILES ----------

  const workingFiles = fs.readdirSync(process.cwd());

  for (const file of workingFiles) {
    if (file === ".vc") continue;
    if (file === ".vcignore") continue;

    if (ignoredFiles.has(file)) continue;

    const fullPath = path.join(process.cwd(), file);

    if (!fs.statSync(fullPath).isFile()) continue;

    if (!commitFiles[file]) {
      return true;
    }
  }

  return false;
}

module.exports = hasChangesFromCommit;
