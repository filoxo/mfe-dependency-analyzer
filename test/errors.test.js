const { expect, test } = require('@oclif/test')
const cmd = require('../lib')

const andValidateErrorIsThrown = (error) => {
  expect(error).to.be.ok
  expect(error.message).to.be.ok
}

describe('mfedeps errors', () => {
  // The fixtures used in these tests are declared in setup-fs.js
  test
    .do(() =>
      cmd.run(['-d', '/fixtures/non-existent-dir', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorIsThrown)
    .it('if --dir does not exist')

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/no-files-match', '-f', 'src/**/*.not-match.js'])
    )
    .catch(andValidateErrorIsThrown)
    .it(`if no --files match in dir`)

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/no-pkg-json', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorIsThrown)
    .it(`if --dir does not have a package.json`)

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/empty-pkg-json', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorIsThrown)
    .it(`if package.json does not have a name field`)

  test
    .do(() =>
      cmd.run(['-d', '/fixtures/invalid-pkg-json', '-f', 'src/**/!(*.test).js'])
    )
    .catch(andValidateErrorIsThrown)
    .it(`if package.json cannot be parsed as JSON`)
})
