const { Command, flags } = require("@oclif/command");
const report = require("./report");

class MfeDependenciesAnalyzerCommand extends Command {
  async run() {
    const { flags } = this.parse(MfeDependenciesAnalyzerCommand);
    const { name, files, options } = flags;
    const result = await report(name, files, options);
    this.log(result);
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
};

module.exports = MfeDependenciesAnalyzerCommand;
