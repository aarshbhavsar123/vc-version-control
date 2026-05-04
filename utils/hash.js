const crypto = require("crypto");

function generateHash(content) {
  return crypto.createHash("sha1").update(content).digest("hex");
}

module.exports = generateHash;
