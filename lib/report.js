const glob = require('glob')
const workerpool = require('workerpool')
const pool = workerpool.pool(__dirname + '/analyze-worker.js')
const { join, sep } = require('path')
const { getExternals, isExternal } = require('./externals')

const globAsync = (files) =>
  new Promise((resolve, reject) => {
    glob(files, (err, matches) => {
      if (err) reject(err)
      resolve(matches)
    })
  })

async function run(dir, files) {
  const matches = await globAsync(join(dir, sep, files))
  if (!matches.length) throw new Error(`No files match '${files}'`)
  const result = (
    await Promise.all(
      matches.map((filePath) => pool.exec('analyze', [dir, filePath]))
    )
  ).flat()
  pool.terminate()
  const externals = getExternals(dir)
  // Apply externals
  result.forEach((dep) => {
    dep.external = isExternal(dep.module, externals)
  })

  return result
}

module.exports = async function generateReport(name, dir, files, options) {
  const result = await run(dir, files)
  const report = {
    name,
    dependencies: result,
  }
  return report
}
