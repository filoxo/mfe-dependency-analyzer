const { parseAsync, loadPartialConfig } = require('@babel/core')
const svelte = require('svelte/compiler')
const fs = require('fs').promises
const walk = require('tree-walk')
const workerpool = require('workerpool')

async function analyze(dir, file) {
  let ast
  switch (true) {
    case file.endsWith('.svelte'): {
      ast = await parseSvelte(file)
      break
    }
    case file.endsWith('.js'):
    default:
      ast = await parseBabel(dir, file)
  }
  const report = getES6Imports(ast, file)
  return report
}

async function parseBabel(dir, file) {
  const { options } = loadPartialConfig({ cwd: dir })
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
