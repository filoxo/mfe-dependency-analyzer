const workerpool = require('workerpool')
const { getExports, getPackageImports } = require('./ast-tools')
const { getAst } = require('./ast-parse')

async function analyze(file) {
  const ast = await getAst(file)
  const report = ast
  // const report = getES6Imports(ast, file)
  // const report = getPackageImports(ast, 'my-package-name')
  // const report = getExports(ast)
  return report
}

workerpool.worker({
  analyze,
})
