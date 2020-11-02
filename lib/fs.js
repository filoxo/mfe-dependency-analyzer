const ogFs = require('fs')

function testFs() {
  const { Volume } = require('memfs')
  const { ufs } = require('unionfs')

  console.log('Setting up /fixtures...\n')

  const fixtures = Volume.fromNestedJSON({
    '/fixtures': {
      '/no-files-match': {},
      '/no-pkg-json': {
        'index.js': 'console.log("no-pkg-json/index.js")',
      },
      '/empty-pkg-json': {
        'package.json': '{}',
      },
      '/invalid-pkg-json': {
        'package.json': '',
      },
    },
  })

  return ufs.use(fixtures).use(ogFs)
}

const fs = !process.env.MFE_DEPS_TEST_FS ? ogFs : testFs()

module.exports = fs
