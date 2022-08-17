const workerpool = require('workerpool')
const { getES6Imports } = require('./ast-tools')
const { getAst } = require('./ast-parse')

async function analyze(file) {
  const ast = getAst(file)
  const report = getES6Imports(ast, file)
  return report
}

workerpool.worker({
  analyze,
})
