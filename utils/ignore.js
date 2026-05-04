const fs = require("fs");
const path = require("path");

function loadIgnoreRules() {

  const ignoreFile = path.join(process.cwd(), ".vcignore");

  if (!fs.existsSync(ignoreFile)) {
    return [];
  }

  const rules = fs.readFileSync(ignoreFile, "utf-8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));

  return rules;
}

function shouldIgnore(filePath, rules) {

  for (const rule of rules) {

    if (rule.startsWith("*.")) {
      const ext = rule.slice(1);
      if (filePath.endsWith(ext)) {
        return true;
      }
    }

    if (filePath.includes(rule)) {
      return true;
    }

  }

  return false;
}

module.exports = {
  loadIgnoreRules,
  shouldIgnore
};