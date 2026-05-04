const fs = require("fs");
const path = require("path");
const { getCurrentBranch } = require("../utils/branch");

function branchCommand(name) {

  const repoPath = path.join(process.cwd(), ".vc");

  const headsPath = path.join(repoPath, "refs", "heads");

  const currentBranch = getCurrentBranch(repoPath);

  const GREEN = "\x1b[32m";
  const RESET = "\x1b[0m";

  // ---------- IF NO NAME PROVIDED ----------
  if (!name) {

    const branches = fs.readdirSync(headsPath);

    branches.forEach((branch) => {
      if (branch === currentBranch) {
        console.log(`${GREEN}* ${branch}${RESET}`);
      } else {
        console.log(`  ${branch}`);
      }
    });

    return;
  }

  // ---------- CREATE NEW BRANCH ----------
  const branchPath = path.join(headsPath, name);

  if (fs.existsSync(branchPath)) {
    console.log("Branch already exists.");
    return;
  }

  const currentCommit = fs
    .readFileSync(path.join(headsPath, currentBranch), "utf-8")
    .trim();

  fs.writeFileSync(branchPath, currentCommit);

  console.log(`Branch ${name} created.`);
}

module.exports = branchCommand;