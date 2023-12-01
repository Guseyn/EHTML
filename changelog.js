const fs = require('fs');
const { execSync } = require('child_process');

// Get the latest Git tag
const latestTag = execSync('git describe --tags --abbrev=0').toString().trim();

// Get the commit messages and hashes since the last tag
const commitData = execSync(`git log ${latestTag}..HEAD --pretty=format:"%h %s"`).toString().trim().split('\n');

// Format the changelog
const changelog = `# Changelog

## Version ${latestTag}

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
