const { expect, test } = require('@oclif/test')
const cmd = require('../lib')

const andValidateErrorMessage = (msg) => (error) => {
  expect(error).to.be.ok
  expect(error.message).to.contain(msg)
}

describe('mfedeps errors', () => {
  test
    .do(() =>
      cmd.run(['-d', '/fixtures/no-files-match', '-f', 'src/**/*.not-match.js'])
    )
    .catch(andValidateErrorMessage('No files match'))
    .it(`if no --files match in dir`)

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/non-existent-dir', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorMessage('Unable to resolve dir'))
    .it('if --dir does not exist')

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/no-pkg-json', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorMessage('Unable to find package.json'))
    .it(`if --dir does not have a package.json`)

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/empty-pkg-json', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorMessage('Unable to read package.json name field'))
    .it(`if package.json does not have a name field`)

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/invalid-pkg-json', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorMessage('Unable to parse package.json'))
    .it(`if package.json cannot be parsed as JSON`)
})
