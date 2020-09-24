const { Command, flags } = require("@oclif/command");
const report = require("./report");
const createVisualization = require("./visualize.js");

class MfeDependenciesAnalyzerCommand extends Command {
  async run() {
    const { flags } = this.parse(MfeDependenciesAnalyzerCommand);
    const { name, files, options, visualize } = flags;
    const result = await report(name, files, options);
    if (visualize) {
      await createVisualization(result);
    } else {
      this.log(JSON.stringify(result, null, 2));
      process.exit(1);
    }
  }
}

MfeDependenciesAnalyzerCommand.flags = {
  version: flags.version({ char: "v" }),
  help: flags.help({ char: "h" }),
  name: flags.string({
    char: "n",
    description: "microfrontend application name",
    required: true,
  }),
  files: flags.string({
    char: "f",
    description: "Glob pattern of files to analyze",
    default: process.cwd(),
  }),
  visualize: flags.boolean({
    char: "r",
    description: "Open local visualization report",
    default: false,
  }),
};

module.exports = MfeDependenciesAnalyzerCommand;
