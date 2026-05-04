#!/usr/bin/env node

const { Command } = require("commander");

const initCommand = require("./commands/init");
const addCommand = require("./commands/add");
const commitCommand = require("./commands/commit");
const branchCommand = require("./commands/branch");
const checkoutCommand = require("./commands/checkout");
const statusCommand = require("./commands/status");
const logCommand = require("./commands/log");
const showCommand = require("./commands/show");
const lsFilesCommand = require("./commands/lsFiles");
const rmCommand = require("./commands/rm");
const stagedDiffCommand = require("./commands/diffStaged");
const diffCommand = require("./commands/diff");
const restoreCommand = require("./commands/restore");
const mergeCommand = require("./commands/merge");

const program = new Command();

program
  .name("vc")
  .description("VC - A simple version control system")
  .version("1.0.0");

// ---------- INIT ----------

program
  .command("init")
  .description("Initialize a new VC repository")
  .action(() => {
    initCommand();
  });

// ---------- ADD ----------

program
  .command("add")
  .description("Add files to staging area")
  .argument("<paths...>", "Files or directories to add")
  .action((paths) => {
    addCommand(paths);
  });

// ---------- COMMIT ----------

program
  .command("commit")
  .description("Create a commit")
  .option("-m, --message <message>", "Commit message")
  .action((options) => {
    commitCommand(options);
  });

// ---------- BRANCH ----------

program
  .command("branch")
  .argument("[name]")
  .description("Create or list branches")
  .action(branchCommand);

// ---------- CHECKOUT ----------

program
  .command("checkout")
  .argument("<branch>")
  .option("-b, --create", "Create branch and switch")
  .description("Switch branches")
  .action((branch, options) => {
    checkoutCommand(branch, options);
  });

// ---------- STATUS ----------

program
  .command("status")
  .description("Show repository status")
  .action(statusCommand);

// ---------- LOG ----------

program
  .command("log")
  .description("Show commit history")
  .action(logCommand);

// ---------- SHOW ----------

program
  .command("show")
  .argument("<commit>")
  .description("Show commit details")
  .action(showCommand);

// ---------- LS FILES ----------

program
  .command("ls-files")
  .description("List staged files")
  .action(lsFilesCommand);

// ---------- REMOVE ----------

program
  .command("rm")
  .argument("<file>")
  .description("Remove file from staging")
  .action(rmCommand);

// ---------- DIFF ----------

program
  .command("diff")
  .description("Show file differences")
  .option("--staged", "Show staged changes")
  .action((options) => {
    if (options.staged) {
      stagedDiffCommand();
    } else {
      diffCommand();
    }
  });

  // ---------- RESTORE ----------

  program
  .command("restore")
  .argument("<file>")
  .option("--staged", "Restore staging area")
  .option("--source <commit>", "Restore from commit")
  .description("Restore file")
  .action((file, options) => {
    restoreCommand(file, options);
  });

  // ---------- MERGE ----------
program
  .command("merge <branch>")
  .description("Merge branch into current branch")
  .action((branch) => {
    mergeCommand(branch);
  });

program.parse(process.argv);