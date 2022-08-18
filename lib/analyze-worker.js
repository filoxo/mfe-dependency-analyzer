const workerpool = require('workerpool')
const { getES6Imports } = require('./ast-tools')
const { getAst } = require('./ast-parse')

async function analyze(file) {
  const ast = await getAst(file)
  return report
}

workerpool.worker({
  analyze,
})
