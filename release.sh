#!/bin/bash

npm version patch --no-git-tag-version
version=$(jq -r '.version' package.json)

# Get the previus version Git commit
previousReleaseCommit=$(git log --grep="^release [0-9]\+\.[0-9]\+\.[0-9]\+" --pretty=format:"%H" -n 2 HEAD | tail -n 1)
echo "Previous Commit Hash: $previousReleaseCommit"

# Get the commit messages and hashes since the last tag
commitData=$(git log $previousReleaseCommit..HEAD^ --pretty=format:"%h %s" --reverse)

# Format the changelog
changelog="# Release $version

$commitData"

# Write the changelog to a file
echo "$changelog" > CHANGELOG.md


awk -v version="$version" '{gsub(/[0-9]+\.[0-9]+\.[0-9]+/, version)}1' README.md > README.md.tmp
mv README.md.tmp README.md
git add --all
git commit -m "release $version" && git tag -a $version -m "$version"
