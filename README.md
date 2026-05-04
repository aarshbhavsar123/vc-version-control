
# Custom Version Control System (VCS)

This project is a lightweight custom implementation of a Version Control System (VCS), inspired by Git.
It allows you to track changes, manage branches, and maintain version history using simple commands.

## Features

- Initialize repository
- Add files to staging
- Commit changes
- View logs
- Check status
- Branch management
- Merge branches
- Restore files
- Diff between changes

## Project Structure

- add.js → Add files to staging area
- branch.js → Create and manage branches
- checkout.js → Switch branches
- commit.js → Commit staged changes
- diff.js → Show differences between files
- diffStaged.js → Show staged changes
- init.js → Initialize repository
- log.js → Show commit history
- lsFiles.js → List tracked files
- merge.js → Merge branches
- restore.js → Restore files
- rm.js → Remove files
- show.js → Show commit details
- status.js → Show working tree status

## Usage

### Initialize repository
```
vc init
```

### Add files
```
vc add <file-name>
```

### Commit changes
```
vc commit -m "commit-message"
```

### Check status
```
vc status
```

### View logs
```
vc log
```

### Create branch
```
vc branch <branch-name>
```

### Checkout branch
```
vc checkout.js <branch-name>
```

### Merge branch
```
vc merge.js <branch-name>
```

### Show diff
```
vc diff.js
```

## Tech Stack

- Node.js
- File System (fs module)



