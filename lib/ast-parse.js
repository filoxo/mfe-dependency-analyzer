const fs = require('fs').promises
const path = require('path')

const { transform } = require('esbuild')
const { parseAsync, loadPartialConfig } = require('@babel/core')
const svelte = require('svelte/compiler')

async function getAst(file) {
  switch (true) {
    case file.endsWith('.svelte'):
      return await parseWithSvelte(file)

    case file.endsWith('.js'):
      // TODO: replace babel with esbuild
      return await parseWithBabel(file)

    case file.endsWith('.ts'):
    case file.endsWith('.tsx'):
      return await parseWithEsbuild(file)

    default:
      throw new Error('Unsupported file type: ' + file)
  }
}

async function parseWithEsbuild(file) {
  const fileBlob = await fs.readFile(file)
  const ast = await transform(fileBlob, {
    loader: 'tsx',
  })
  return ast
}

async function parseWithBabel(file) {
  const dir = path.basename(file)
  const { options } = loadPartialConfig({ cwd: dir })
  options.filename = dir
  const fileBlob = await fs.readFile(file)
  const ast = await parseAsync(fileBlob, options)
  return ast
}

async function parseWithSvelte(file) {
  const fileBlob = await fs.readFile(file)
  const ast = svelte.parse(fileBlob).instance
  return ast
}

module.exports = {
  getAst,
}
