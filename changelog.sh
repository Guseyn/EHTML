#!/bin/bash

# Get the previus version Git commit
previousCommit=$(git log -n 1 --grep="^[0-9]\+\.[0-9]\+\.[0-9]\+" --pretty=format:"%H" HEAD~1)
echo "Previous Commit Hash: $previousCommit"

# Get the commit messages and hashes since the last tag
commitData=$(git log $previousCommit..HEAD --pretty=format:"%h %s" --reverse)

# Get latest version
latestTag=$(git describe --tags --abbrev=0)
latestCommitMessage=$(git log -n 1 --pretty=format:"%s" $latestTag)

# Format the changelog
changelog="# Changelog $latestCommitMessage

## Version $latestCommitMessage

$commitData

"

# Write the changelog to a file
echo "$changelog" > CHANGELOG.md
