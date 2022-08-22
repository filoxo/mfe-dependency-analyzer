const glob = require('glob')
const workerpool = require('workerpool')
const pool = workerpool.pool(__dirname + '/analyze-worker.js')
const { join, sep } = require('path')
const { uniq } = require('./utils')

const globAsync = (files) =>
  new Promise((resolve, reject) => {
    glob(files, (err, matches) => {
      if (err) reject(err)
      resolve(matches)
    })
  })

module.exports = async function report(name, dir, files) {
  const matches = await globAsync(join(dir, sep, files))
  if (!matches.length) throw new Error(`No files match '${files}'`)
  const result = (
    await Promise.all(
      matches.map((filePath) => pool.exec('analyze', [filePath]))
    )
  ).flat()

  pool.terminate()

  return result
}
