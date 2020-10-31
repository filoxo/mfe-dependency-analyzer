const { expect, test } = require('@oclif/test')
const cmd = require('../lib')

const hasErrorMessage = (error) => {
  expect(error).to.be.ok
  expect(error.message).to.be.ok
}

const FIXTURE_DIR = 'mfe-dependencies-test-repo'

describe('mfedeps', () => {
  test
    .stdout()
    .do(() => cmd.run(['-d', FIXTURE_DIR, '-f', 'src/**/!(*.test).js']))
    .it('runs with files', (ctx) => {
      expect(ctx.stdout).to.contain('@example/home')
    })

  describe('errors', () => {
    test
      .do(() =>
        cmd.run(['-d', 'non-existent-dir', '-f', 'src/**/!(*.test).js'])
      )
      .catch(hasErrorMessage)
      .it('if --dir does not exist')

    test
      .do(() => cmd.run(['-d', FIXTURE_DIR, '-f', 'src/**/*.not-match.js']))
      .catch(hasErrorMessage)
      .it(`if no --files match in dir`)
  })
})
