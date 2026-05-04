const fs = require("fs");
const path = require("path");
const { getCurrentBranch } = require("../utils/branch");

function restoreCommand(file, options) {

  const repoPath = path.join(process.cwd(), ".vc");
  const indexPath = path.join(repoPath, "index");
  const objectsPath = path.join(repoPath, "objects");
  const commitsPath = path.join(repoPath, "commits");

  if (!fs.existsSync(repoPath)) {
    console.log("Not a VC repository");
    return;
  }

  if (!fs.existsSync(indexPath)) {
    console.log("Nothing staged");
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath));

  // ---------- RESTORE FROM SPECIFIC COMMIT ----------

  if (options.source) {

    const commitPath = path.join(commitsPath, options.source + ".json");

    if (!fs.existsSync(commitPath)) {
      console.log("Commit not found");
      return;
    }

    const commit = JSON.parse(fs.readFileSync(commitPath));

    if (!commit.files[file]) {
      console.log("File not found in that commit");
      return;
    }

    const hash = commit.files[file];
    const objectPath = path.join(objectsPath, hash);

    const content = fs.readFileSync(objectPath, "utf8");

    fs.writeFileSync(path.join(process.cwd(), file), content);

    console.log(`Restored ${file} from commit ${options.source}`);

    return;
  }

  // ---------- RESTORE STAGING AREA ----------

  if (options.staged) {

    const currentBranch = getCurrentBranch(repoPath);
    const branchPath = path.join(repoPath, "refs", "heads", currentBranch);

    if (!fs.existsSync(branchPath)) {
      console.log("No commits yet");
      return;
    }

    const commitHash = fs.readFileSync(branchPath, "utf8").trim();

    const commitPath = path.join(commitsPath, commitHash + ".json");

    const commit = JSON.parse(fs.readFileSync(commitPath));

    if (!commit.files[file]) {

      delete index[file];
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

      console.log(`Removed ${file} from staging`);
      return;
    }

    index[file] = commit.files[file];

    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    console.log(`Unstaged ${file}`);

    return;
  }

  // ---------- DEFAULT RESTORE (STAGING → WORKING) ----------

  if (!index[file]) {
    console.log("File not in staging");
    return;
  }

  const hash = index[file];
  const objectPath = path.join(objectsPath, hash);

  const content = fs.readFileSync(objectPath, "utf8");

  fs.writeFileSync(path.join(process.cwd(), file), content);

  console.log(`Restored ${file}`);
}

module.exports = restoreCommand;