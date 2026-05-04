const fs = require("fs");
const path = require("path");

function initCommand() {

  const repoPath = path.join(process.cwd(), ".vc");

  if (fs.existsSync(repoPath)) {
    console.log("Repository already exists.");
    return;
  }

  fs.mkdirSync(repoPath);
  fs.mkdirSync(path.join(repoPath, "objects"));
  fs.mkdirSync(path.join(repoPath, "commits"));
  fs.mkdirSync(path.join(repoPath, "refs"));
  fs.mkdirSync(path.join(repoPath, "refs", "heads"), { recursive: true });

  fs.writeFileSync(path.join(repoPath, "index"), "{}");

  fs.writeFileSync(
    path.join(repoPath, "HEAD"),
    "ref: refs/heads/main"
  );

  fs.writeFileSync(
    path.join(repoPath, "refs", "heads", "main"),
    ""
  );

  console.log("Initialized empty VC repository");
}

module.exports = initCommand;