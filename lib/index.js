const { resolve } = require('path')
const { promises, existsSync } = require('./fs')
const { readFile } = promises
const { Command, flags } = require('@oclif/command')
const generateReport = require('./report')
const { uniq } = require('./utils')

class MfeDependenciesAnalyzerCommand extends Command {
  async run() {
    let { dir, files, name } = this.parse(MfeDependenciesAnalyzerCommand).flags

    dir = resolve(dir)
    if (!existsSync(dir)) throw new Error(`Unable to resolve dir ${dir}`)

    if (!name) {
      let packageJsonBlob
      try {
        packageJsonBlob = await readFile(resolve(dir, 'package.json'), 'utf-8')
      } catch (e) {
        throw new Error(
          `Unable to find package.json in ${dir}. Verify that the dir is correct, or use the --name flag instead.`
        )
      }
      try {
        name = JSON.parse(packageJsonBlob).name
      } catch (e) {
        throw new Error(`Unable to parse package.json in ${dir}.`)
      }

      if (!name) {
        throw new Error(
          `Unable to read package.json name field. Verify that a name field is declared, or use the --name flag instead.`
        )
      }
    }

    const report = await generateReport(name, dir, files)
    const result = uniq(report.sort()).join('\n')
    console.log('result', result)
  }
}

MfeDependenciesAnalyzerCommand.flags = {
  version: flags.version({ char: 'v' }),
  help: flags.help({ char: 'h' }),
  dir: flags.string({
    char: 'd',
    description: 'Project source dir to analyze',
    default: '.',
  }),
  files: flags.string({
    char: 'f',
    description: 'Glob pattern of files inside dir to analyze',
    default: '"src/**/!(*.test|*.spec).js"',
  }),
  name: flags.string({
    char: 'n',
    description: 'Microfrontend application name',
  }),
  visualize: flags.boolean({
    char: 'r',
    description: 'Open local visualization report',
    default: false,
  }),
}

module.exports = MfeDependenciesAnalyzerCommand
