import path from 'node:path'
import { copyFile, readdir, stat, readFile } from 'node:fs/promises'
import { build } from 'esbuild'
import glob from 'fast-glob'

const dynamicImportsByFiles = {
  'src/E/e-markdown.js': (contents) => {
    if (
      contents.includes("import showdownHighlight from 'ehtml/third-party/showdown-highlight'") &&
      contents.includes("import showdownKatex from 'ehtml/third-party/showdown-katex/showdown-katex'")
    ) {
      contents = contents.replace(
`import showdownHighlight from 'ehtml/third-party/showdown-highlight'
import showdownKatex from 'ehtml/third-party/showdown-katex/showdown-katex'`,
`
let showdownHighlight = null
let showdownKatex = null
if (typeof _EHTML_MODE_ === 'string' && _EHTML_MODE_ === 'NORMAL') {
  const [highlight, katex] = await Promise.all([
    import('ehtml/third-party/showdown-highlight'),
    import('ehtml/third-party/showdown-katex/showdown-katex')
  ])

  showdownHighlight = highlight.default
  showdownKatex = katex.default
}`
      )
      return contents
    }
  }
}

const replaceStaticImports = {
  name: 'replace-optional-markdown-imports',
  setup(build) {
    build.onLoad({ filter: /\.js$/ }, async (args) => {
      let contents = await readFile(args.path, 'utf8')

      const fileKey = args.path.split('EHTML/')[1]

      if (dynamicImportsByFiles[fileKey]) {
        contents = dynamicImportsByFiles[fileKey](contents)
      }

      return {
        contents,
        loader: 'js',
      }
    })
  }
}

const baseDir = path.resolve('./src')

async function readDirRecursive(dir) {
  const result = []

  for (const entry of await readdir(dir)) {
    const fullPath = path.join(dir, entry)
    const stats = await stat(fullPath)

    if (stats.isDirectory()) {
      result.push(...await readDirRecursive(fullPath))
    } else {
      result.push(fullPath)
    }
  }

  return result
}

const alias = {}

const files = await glob('**/*.js', { cwd: baseDir })

for (const file of files) {
  const importPath = 'ehtml/' + file
    .replace(/\\/g, '/')
    .replace(/\.min\.js$/, '')
    .replace(/\.js$/, '')
  const filePath = path.join(baseDir, file)
  alias[importPath] = filePath
}

await build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/ehtml.min.js',
  alias,
  minify: false,
  sourcemap: true,
  define: {
    '_EHTML_MODE_': '"NORMAL"'
  },
  plugins: [replaceStaticImports]
})

await build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/ehtml.light.min.js',
  alias,
  minify: false,
  sourcemap: true,
  external: [
    './src/third-party/he.js',
    './src/third-party/highlight.min.js',
    './src/third-party/katex/auto-render.js',
    './src/third-party/katex/katex.min.js',
    './src/third-party/showdown-highlight.js',
    './src/third-party/showdown-katex/asciimath-to-tex.min.js',
    './src/third-party/showdown-katex/showdown-katex.js',
  ],
  define: {
    '_EHTML_MODE_': '"LIGHT"'
  },
  plugins: [replaceStaticImports]
})

await copyFile('dist/ehtml.min.js', './examples/static/js/ehtml.min.js')
await copyFile('dist/ehtml.min.js.map', './examples/static/js/ehtml.min.js.map')
await copyFile('dist/ehtml.light.min.js', './examples/static/js/ehtml.light.min.js')
await copyFile('dist/ehtml.light.min.js.map', './examples/static/js/ehtml.light.min.js.map')
