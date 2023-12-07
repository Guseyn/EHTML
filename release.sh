#!/bin/bash

npm version patch --no-git-tag-version
version=$(jq -r '.version' package.json)

echo "Current version: $version"

# Get the previus version Git commit
previousTag=$(git describe --tags --abbrev=0 HEAD^)

echo "Previous version: $previousTag"

# Get the commit messages and hashes since the last tag
commitData=$(git log --pretty=format:"%h %s (%an, %ad)" $previous_tag..HEAD)

echo "commit history: $commitData"

# Format the changelog
changelog="# Release $version

$commitData"

# Write the changelog to a file
echo "$changelog" > CHANGELOG.md

awk -v version="$version" '{gsub(/[0-9]+\.[0-9]+\.[0-9]+/, version)}1' README.md > README.md.tmp
mv README.md.tmp README.md
git add --all
git commit -m "$version" && git tag -a "v$version" -m "$version"
