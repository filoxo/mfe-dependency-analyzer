const fs = require('fs').promises
const path = require('path')

const { parseAsync, loadPartialConfig } = require('@babel/core')
const svelte = require('svelte/compiler')

async function getAst(file) {
  switch (true) {
    case file.endsWith('.svelte'):
      return parseWithSvelte(file)

    case file.endsWith('.js'):
    case file.endsWith('.ts'):
    case file.endsWith('.tsx'):
      return parseWithBabel(file)

    default:
      throw new Error('Unsupported file type: ' + file)
  }
}

async function parseWithBabel(file) {
  const filename = path.basename(file)
  const { options: partialOptions } = loadPartialConfig({
    filename,
  })
  const options = {
    ...partialOptions,
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-typescript'),
    ],
  }
  const fileBlob = await fs.readFile(file, { encoding: 'utf-8' })
  const ast = await parseAsync(fileBlob, options)
  return ast
}

async function parseWithSvelte(file) {
  const fileBlob = await fs.readFile(file, { encoding: 'utf-8' })
  const ast = svelte.parse(fileBlob).instance
  return ast
}

module.exports = {
  getAst,
}
