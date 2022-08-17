const { parseAsync, loadPartialConfig } = require('@babel/core')
const svelte = require('svelte/compiler')
const fs = require('fs').promises
const path = require('path')
const walk = require('tree-walk')
const workerpool = require('workerpool')
const { transform } = require('esbuild')

async function analyze(dir, file) {
  let ast
  switch (true) {
    case file.endsWith('.svelte'): {
      ast = await parseSvelte(file)
      break
    }
    case file.endsWith('.js'): {
      // TODO: replace babel with esbuild
      ast = await parseBabel(dir, file)
      break
    }
    case file.endsWith('.ts'):
    case file.endsWith('.tsx'): {
      ast = await parseEsbuild(file)
      break
    }

    default:
      throw new Error('Unsupported file type: ' + file)
  }
  const report = getES6Imports(ast, file)
  return report
}

async function parseEsbuild(file) {
  const fileBlob = await fs.readFile(file, { encoding: 'utf-8' })
  const ast = await transform(fileBlob, {
    loader: 'tsx',
  })
  return ast
}

async function parseBabel(dir, file) {
  const { options } = loadPartialConfig({ cwd: dir })
  options.filename = path.basename(file)
  const fileBlob = await fs.readFile(file, { encoding: 'utf-8' })
  const ast = await parseAsync(fileBlob, options)
  return ast
}

async function parseSvelte(file) {
  const fileBlob = await fs.readFile(file, { encoding: 'utf-8' })
  const ast = svelte.parse(fileBlob).instance
  return ast
}

function getNodesByType(tree, nodeType) {
  return walk.filter(
    tree,
    walk.preorder,
    (value, key, parent) =>
      value &&
      typeof value === 'object' &&
      value.type &&
      value.type === nodeType
  )
}

function getES6Imports(ast, source) {
  return getNodesByType(ast, 'ImportDeclaration')
    .filter(
      (node) => !node.source.value.startsWith('.') /* is not local import */
    )
    .map((node) => ({
      type: 'ES6',
      import: node.specifiers.map(({ type, imported, local }) => ({
        type: mapToReadableSpecifierType(type),
        name: (imported && imported.name) || local.name,
      })),
      module: node.source.value,
      source,
    }))
}

function mapToReadableSpecifierType(type) {
  switch (type) {
    case 'ImportSpecifier':
      return 'specifier'
    case 'ImportDefaultSpecifier':
      return 'default'
    case 'ImportNamespaceSpecifier':
      return 'namespace'
    default:
      throw new Error(`Unexpected import of type ${type}`)
  }
}

workerpool.worker({
  analyze,
})
