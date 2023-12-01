const fs = require('fs');
const { execSync } = require('child_process');

// Get the latest Git tag
const previousCommit = execSync('git rev-list -n 1 --grep="^[0-9]\+\.[0-9]\+\.[0-9]\+" HEAD^').toString().trim();

// Get the commit messages and hashes since the last tag
const commitData = execSync(`git log ${previousCommit}..HEAD --pretty=format:"%h %s"`).toString().trim().split('\n');

// Format the changelog
const changelog = `# Changelog

## Version ${previousCommit}

${formatCommits(commitData)}

`;

// Write the changelog to a file
fs.writeFileSync('CHANGELOG.md', changelog);

/**
 * Format commit messages and hashes for the changelog
 * @param {string[]} commits - Array of commit messages and hashes
 * @returns {string} - Formatted changelog content
 */
function formatCommits(commits) {
  return commits.map(commit => `- ${commit}`).join('\n');
}
