const { expect, test } = require('@oclif/test');
const cmd = require('../lib');

describe('mfedeps', () => {
  test
    .stdout()
    .do(() =>
      cmd.run(['-d', 'mfe-deps-test-repo', '-f', 'src/**/!(*.test).js'])
    )
    .it('runs with files', (ctx) => {
      expect(ctx.stdout).to.contain('@example/home');
    });
});
