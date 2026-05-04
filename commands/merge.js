const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { getCurrentBranch } = require("../utils/branch");
const hasChangesFromCommit = require("../utils/hasChangesFromCommit");

function hashContent(content) {
  return crypto.createHash("sha1").update(content).digest("hex");
}

function mergeLines(currentContent, incomingContent, currentBranch, incomingBranch) {

  const currentLines = currentContent.split("\n");
  const incomingLines = incomingContent.split("\n");

  const maxLen = Math.max(currentLines.length, incomingLines.length);

  let merged = [];
  let i = 0;

  while (i < maxLen) {

    const cur = currentLines[i] || "";
    const inc = incomingLines[i] || "";

    if (cur === inc) {
      merged.push(cur);
      i++;
      continue;
    }

    let curBlock = [];
    let incBlock = [];

    while (i < maxLen && currentLines[i] !== incomingLines[i]) {

      curBlock.push(currentLines[i] || "");
      incBlock.push(incomingLines[i] || "");

      i++;
    }

    merged.push(`<<<<<<< ${currentBranch}`);
    merged.push(...curBlock);
    merged.push("=======");
    merged.push(...incBlock);
    merged.push(`>>>>>>> ${incomingBranch}`);
  }

  return merged.join("\n");
}

function mergeCommand(sourceBranch) {

  const repoPath = path.join(process.cwd(), ".vc");

  if (!fs.existsSync(repoPath)) {
    console.log("Not a vc repository.");
    return;
  }

  if (hasChangesFromCommit(repoPath)) {
    console.log("Please commit current changes before merging.");
    return;
  }

  const headsPath = path.join(repoPath, "refs", "heads");

  const currentBranch = getCurrentBranch(repoPath);

  if (currentBranch === sourceBranch) {
    console.log("Cannot merge same branch.");
    return;
  }

  const currentBranchFile = path.join(headsPath, currentBranch);
  const sourceBranchFile = path.join(headsPath, sourceBranch);

  if (!fs.existsSync(sourceBranchFile)) {
    console.log("Source branch does not exist.");
    return;
  }

  const currentCommitHash = fs.readFileSync(currentBranchFile, "utf8").trim();
  const sourceCommitHash = fs.readFileSync(sourceBranchFile, "utf8").trim();

  const commitsPath = path.join(repoPath, "commits");

  const currentCommit = JSON.parse(
    fs.readFileSync(path.join(commitsPath, currentCommitHash ))
  );

  const sourceCommit = JSON.parse(
    fs.readFileSync(path.join(commitsPath, sourceCommitHash ))
  );

  const mergedFiles = { ...currentCommit.files };

  const objectsPath = path.join(repoPath, "objects");

  for (const file in sourceCommit.files) {

    const sourceHash = sourceCommit.files[file];
    const currentHash = currentCommit.files[file];

    // ---------- file only in source branch ----------
    if (!currentHash) {

      const content = fs.readFileSync(
        path.join(objectsPath, sourceHash),
        "utf8"
      );

      fs.writeFileSync(file, content);

      mergedFiles[file] = sourceHash;

      continue;
    }

    // ---------- hashes same ----------
    if (currentHash === sourceHash) {
      continue;
    }

    // ---------- conflict case ----------
    const currentContent = fs.readFileSync(
      path.join(objectsPath, currentHash),
      "utf8"
    );

    const sourceContent = fs.readFileSync(
      path.join(objectsPath, sourceHash),
      "utf8"
    );

    const mergedContent = mergeLines(
      currentContent,
      sourceContent,
      currentBranch,
      sourceBranch
    );

    fs.writeFileSync(file, mergedContent);

    const newHash = hashContent(mergedContent);

    fs.writeFileSync(
      path.join(objectsPath, newHash),
      mergedContent
    );

    mergedFiles[file] = newHash;

    console.log(`Conflict in ${file}`);
  }

  const commitData = {
    message: `Merge branch ${sourceBranch} into ${currentBranch}`,
    parent: [currentCommitHash, sourceCommitHash],
    files: mergedFiles
  };

  const commitString = JSON.stringify(commitData, null, 2);

  const newCommitHash = hashContent(commitString);

  fs.writeFileSync(
    path.join(commitsPath, newCommitHash ),
    commitString
  );

  fs.writeFileSync(currentBranchFile, newCommitHash);

  console.log(`Merged ${sourceBranch} into ${currentBranch}`);
}

module.exports = mergeCommand;