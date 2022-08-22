const walk = require('tree-walk')

function getNodesByType(tree, nodeType) {
  const types = Array.isArray(nodeType) ? nodeType : [nodeType]
  return walk.filter(tree, walk.preorder, (value, key, parent) =>
    types.includes(value?.type)
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

/*
TODO: add tests to ensure that it can handle...

import { something } from 'somewhere'
import { something as somethingElse } from 'somewhere'
import type { someType } from 'somewhere'
import * as something from 'somewhere'
import something from 'somewhere'
*/
function getPackageImports(ast, pkgName) {
  return getNodesByType(ast, 'ImportDeclaration')
    .filter((node) => node.source.value === pkgName)
    .flatMap((node) =>
      node.specifiers.map(
        (specifier) => specifier.imported?.name || specifier.local?.name
      )
    )
}

/*
TODO: add tests to ensure it can handle...

export default something;
export something;
export { something } from 'somewhere-else'
export { something as somethingElse } from 'somewhere-else'
export type someType; 
*/
function getExports(ast) {
  return getNodesByType(ast, [
    'ExportSpecifier',
    'ExportNamespaceSpecifier',
  ]).map((specifier) => {
    return specifier.exported?.name || specifier.local?.name
  })
}

module.exports = {
  getES6Imports,
  getNodesByType,
  getPackageImports,
  getExports,
}
