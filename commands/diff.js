const fs = require("fs");
const path = require("path");

function diffCommand() {

  const repoPath = path.join(process.cwd(), ".vc");
  const indexPath = path.join(repoPath, "index");
  const objectsPath = path.join(repoPath, "objects");

  let index = {};

  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath));
  }

  const files = fs.readdirSync(process.cwd());

  for (const file of files) {

    if (file === ".vc") continue;

    const filePath = path.join(process.cwd(), file);

    if (!fs.statSync(filePath).isFile()) continue;

    const newContent = fs.readFileSync(filePath, "utf8").split("\n");

    // ---------- FILE NOT STAGED ----------
    if (!index[file]) {

      console.log(`\nDiff for ${file}`);

      for (const line of newContent) {
        console.log("\x1b[32m+ " + line + "\x1b[0m");
      }

      continue;
    }

    // ---------- FILE STAGED ----------
    const storedFile = path.join(objectsPath, index[file]);

    if (!fs.existsSync(storedFile)) continue;

    const oldContent = fs.readFileSync(storedFile, "utf8").split("\n");

    console.log(`\nDiff for ${file}`);

    const maxLines = Math.max(oldContent.length, newContent.length);

    for (let i = 0; i < maxLines; i++) {

      const oldLine = oldContent[i];
      const newLine = newContent[i];

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

module.exports = diffCommand;