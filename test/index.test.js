const { expect, test } = require('@oclif/test')
const cmd = require('../lib')

describe('mfedeps', () => {
  /*
   These tests will rely on real application code in mfe-dependencies-test-repo submodule so that it can assume:
    - installed node_modules
    - full file paths
    - module resolution
    - executable src and config files
  */
  test
    .stdout()
    .do(() =>
      cmd.run(['-d', 'mfe-dependencies-test-repo', '-f', 'src/**/!(*.test).js'])
    )
    .it('runs with files', (ctx) => {
      expect(ctx.stdout).to.contain('@example/home')
    })
})
