const { expect, test } = require('@oclif/test');
const cmd = require('../lib');

const hasErrorMessage = (error) => expect(error.message).to.be.ok;

describe('mfedeps', () => {
  test
    .stdout()
    .do(() =>
      cmd.run(['-d', 'mfe-deps-test-repo', '-f', 'src/**/!(*.test).js'])
    )
    .it('runs with files', (ctx) => {
      expect(ctx.stdout).to.contain('@example/home');
    });

  describe('errors', () => {
    test
      .do(() =>
        cmd.run(['-d', 'non-existent-dir', '-f', 'src/**/!(*.test).js'])
      )
      .catch(hasErrorMessage)
      .it('if --dir does not exist');

    test
      .do(() =>
        cmd.run(['-d', 'mfe-deps-test-repo', '-f', 'src/**/*.not-match.js'])
      )
      .catch(hasErrorMessage)
      .it(`if no --files match in dir`);
  });
});
