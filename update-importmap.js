#!/usr/bin/env node

const { promises: fs } = require('fs')
const path = require('path')

async function getHtmlFiles(dir) {
  let results = []
  const list = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of list) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      results = results.concat(await getHtmlFiles(res))
    } else if (res.endsWith('.html')) {
      results.push(res)
    }
  }
  return results
}

async function processFile(filePath, importmapString) {
  let content = await fs.readFile(filePath, 'utf8')

  // capture leading indent in group 1, the opening <script> in 2, old content in 3, closing tag in 4
  const regex = /(^[ \t]*)(<script\b[^>]*type=['"]importmap['"][^>]*>)([\s\S]*?)(<\/script>)/im

  if (!regex.test(content)) {
    console.warn(`No <script type="importmap"> tag found in ${filePath}`)
    return
  }

  content = content.replace(regex, (_, indent, openTag, oldBody, closeTag) => {
    // indent each line of the JSON
    const indentedJson = importmapString
      .split('\n')
      .map(line => indent + line)
      .join('\n')

    // reconstruct, preserving your original indent
    return [
      indent + openTag,
      indentedJson,
      indent + closeTag
    ].join('\n')
  })

  await fs.writeFile(filePath, content, 'utf8')
  console.log(`Updated ${filePath}`)
}

async function main() {
  const [importmapPath, htmlDir] = process.argv.slice(2)
  if (!importmapPath || !htmlDir) {
    console.error('Usage: node update-importmap.js <importmap.json> <html-directory>')
    process.exit(1)
  }

  let importmapJson
  try {
    const importmapContent = await fs.readFile(importmapPath, 'utf8')
    importmapJson = JSON.parse(importmapContent)
  } catch (err) {
    console.error(`Error reading or parsing ${importmapPath}:`, err.message)
    process.exit(1)
  }

  // pretty‐print with 2-space JSON, ready for indentation
  const importmapString = JSON.stringify(importmapJson, null, 2)
  const htmlFiles = await getHtmlFiles(path.resolve(htmlDir))

  if (htmlFiles.length === 0) {
    console.warn(`No HTML files found in directory ${htmlDir}`)
    return
  }

  for (const file of htmlFiles) {
    await processFile(file, importmapString)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
