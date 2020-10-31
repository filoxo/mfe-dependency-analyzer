const { expect, test } = require('@oclif/test')
const cmd = require('../lib')
const { join } = require('path')

const andValidateErrorIsThrown = (error) => {
  expect(error).to.be.ok
  expect(error.message).to.be.ok
}

const FIXTURE_DIR = 'mfe-dependencies-test-repo'

/*
It seems that mock-fs isn't compatible with oclif so I can't just mock these filesystem fixtures
https://github.com/oclif/oclif/issues/182#issuecomment-433554720
Instead, I'm going with real directory/file fixtures that will be maintained as a separate repo
*/
const fixtureAt = (fixtureDir) => join('./test/fixtures/', fixtureDir)

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
      .catch(andValidateErrorIsThrown)
      .it('if --dir does not exist')

    test
      .do(() => cmd.run(['-d', FIXTURE_DIR, '-f', 'src/**/*.not-match.js']))
      .catch(andValidateErrorIsThrown)
      .it(`if no --files match in dir`)

    test
      .do(() =>
        cmd.run(['-d', fixtureAt('no-pkg-json'), '-f', 'src/**/!(*.test).js'])
      )
      .catch(andValidateErrorIsThrown)
      .it(`if --dir does not have a package.json`)

    test
      .do(() =>
        cmd.run([
          '-d',
          fixtureAt('empty-pkg-json'),
          '-f',
          'src/**/!(*.test).js',
        ])
      )
      .catch(andValidateErrorIsThrown)
      .it(`if package.json does not have a name field`)

    test
      .do(() =>
        cmd.run([
          '-d',
          fixtureAt('invalid-pkg-json'),
          '-f',
          'src/**/!(*.test).js',
        ])
      )
      .catch(andValidateErrorIsThrown)
      .it(`if package.json cannot be parsed as JSON`)
  })
})
