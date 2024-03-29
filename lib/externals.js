const { join, sep, resolve } = require('path')
const { is } = require('./utils')
const esRequire = require('esm')(module)

const CONFIG = {
  WEBPACK: 'webpack.config.js',
  ROLLUP: 'rollup.config.js',
  PACKAGE_JSON: 'package.json',
}

function resolveConfig(dir, filename, req = require) {
  let config
  try {
    const configPath = resolve(join(dir, sep, filename))
    config = req(configPath)
  } catch (e) {
    console.error(`Unable to resolve ${filename} in ${dir}. Skipping...`)
  }
  return config
}

function getConfigFromWebpack(dir) {
  return resolveConfig(dir, CONFIG.WEBPACK)
}

function getConfigFromRollup(dir) {
  // Rollup configs are esm, so loading use esm require
  const config = resolveConfig(dir, CONFIG.ROLLUP, esRequire)
  return config && config.default
}

function getConfigFromPackageJson(dir) {
  return resolveConfig(dir, CONFIG.PACKAGE_JSON).config
}

/* 
Both webpack and rollup configs can be:
- object
- function
- array of objects
- array of functions
- Promise

https://webpack.js.org/configuration/configuration-types/
https://rollupjs.org/guide/en/#configuration-files

The function and Promise styles are difficult to support. They both require passing in 
[env, argv] to webpack or [commandLineArgs] to rollup, which represent run-time configuration values. 
The approach I'm taking is to naively call them without those values. If: 
  1) the args values aren't used (function would error if attempting to use args that are undefined), and 
  2) externals are not conditional based on args
it should be able to return externals.

If all else fails, simply ask users to provide the externals. 
*/
function getExternalsFromConfig(config) {
  if (is.func(config)) {
    try {
      config = config()
    } catch (e) {
      console.error(e)
      throw new Error(
        'Unable to evaluate config as a function to get externals.'
      )
    }
  }

  if (is.promise(config))
    throw new Error(
      'Extracting externals from config as a Promise/thenable is not supported.'
    )

  if (is.array(config))
    throw new Error(
      'Bundler config is an array, so externals would be amgibuous.'
    )

  // webpack uses "externals" (plural)
  // rollup uses "external" (singular)
  return validateExternals(config.externals || config.external || [])
}

/*
This utility suffers from the same limitations as getExternalsFromConfig; 
externals as a function require run-time configuration values. It'd be super
unreliable to attempt to call it without getting those arguments exactly right. 
*/
function validateExternals(externals) {
  if (!externals) {
    throw new Error('Externals were undefined')
  }
  if (is.func(externals))
    throw new Error(
      'Externals as a function were detected, which is not supported'
    )
  if (is.array(externals) && externals.some(is.func))
    throw new Error(
      'A value in the externals array was a function, which is not supported'
    )

  return !is.array(externals) ? Object.keys(externals) : externals
}

function getExternals(projectDir) {
  const webpackConfig = getConfigFromWebpack(projectDir)
  if (!webpackConfig)
    console.info('Unable to get config from webpack. Skipping.')

  const rollupConfig = getConfigFromRollup(projectDir)
  if (!rollupConfig) console.info('Unable to get config from rollup. Skipping.')

  const packageJsonConfig = getConfigFromPackageJson(projectDir)

  if (!packageJsonConfig)
    console.info('Unable to get config from package.json.')

  const config = webpackConfig || rollupConfig || packageJsonConfig

  if (!config) {
    throw new Error(
      'Unable to resolve configs from any source that may contain externals.'
    )
  }

  const externals = getExternalsFromConfig(config)

  return externals
}

function isExternal(moduleId, externals) {
  if (!externals && !is.array(externals)) return false
  return externals.some((ext) => {
    switch (true) {
      case is.string(ext):
        return moduleId === ext
      case is.func(ext):
        return ext(moduleId)
      case is.regex(ext):
        return ext.test(moduleId)
      default:
        throw new Error(
          `external ${ext} didn't match any of the expected type cases.`
        )
    }
  })
}

module.exports.getExternals = getExternals
module.exports.isExternal = isExternal
