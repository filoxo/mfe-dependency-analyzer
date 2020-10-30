const { resolve } = require('path');
const { promises, existsSync } = require('fs');
const { readFile } = promises;
const { Command, flags } = require('@oclif/command');
const report = require('./report');
const createVisualization = require('./visualize.js');

class MfeDependenciesAnalyzerCommand extends Command {
  async run() {
    const { flags } = this.parse(MfeDependenciesAnalyzerCommand);
    let { dir, files, name, options, visualize } = flags;

    dir = resolve(dir);
    if (!existsSync(dir)) throw new Error(`Unable to resolve dir ${dir}`);
    const packageJsonPath = resolve(dir, 'package.json');

    if (!name) {
      let packageJsonBlob;
      try {
        packageJsonBlob = await readFile(packageJsonPath, 'utf-8');
      } catch (e) {
        throw new Error(
          `Unable to find package.json in ${dir}. Verify that the dir is correct, or use the --name flag instead.`
        );
      }
      try {
        name = JSON.parse(packageJsonBlob).name;
      } catch (e) {
        throw new Error(`Unable to parse package.json in ${dir}.`);
      }

      if (!name) {
        throw new Error(
          `Unable to read package.json name field. Verify that a name field is declared, or use the --name flag instead.`
        );
      }
    }

    const result = await report(name, dir, files, options);
    if (visualize) {
      await createVisualization(result);
    } else {
      this.log(JSON.stringify(result, null, 2));
      process.exit(0);
    }
  }
}

MfeDependenciesAnalyzerCommand.flags = {
  version: flags.version({ char: 'v' }),
  help: flags.help({ char: 'h' }),
  dir: flags.string({
    char: 'd',
    description: 'directory to find project files in to analyze',
    default: '.',
  }),
  files: flags.string({
    char: 'f',
    description: 'Glob pattern of files inside directory to analyze',
    default: process.cwd(),
  }),
  name: flags.string({
    char: 'n',
    description: 'microfrontend application name',
  }),
  visualize: flags.boolean({
    char: 'r',
    description: 'Open local visualization report',
    default: false,
  }),
};

module.exports = MfeDependenciesAnalyzerCommand;
