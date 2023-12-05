#!/bin/bash

npm version patch
version=$(jq -r '.version' package.json)

# Get the previus version Git commit
previousCommit=$(git log --grep="^[0-9]\+\.[0-9]\+\.[0-9]\+" --pretty=format:"%H" -n 2 HEAD | tail -n 1)
echo "Previous Commit Hash: $previousCommit"

# Get the commit messages and hashes since the last tag
commitData=$(git log $previousCommit..HEAD^ --pretty=format:"%h %s" --reverse)

# Get latest version
latestTag=$(git describe --tags --abbrev=0)
latestCommitMessage=$(git log -n 1 --pretty=format:"%s" $latestTag)

# Format the changelog
changelog="# Release $latestTag

$commitData"

# Write the changelog to a file
echo "$changelog" > CHANGELOG.md


sed -i "s/\*\*v[0-9]\+\.[0-9]\+\.[0-9]\+\*\*/\*\*$version\*\*/g" README.md
git add --all
git commit -m "release $latestTag"
