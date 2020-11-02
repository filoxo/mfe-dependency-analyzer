const { Volume } = require('memfs')
const { ufs } = require('unionfs')
const fs = require('fs')
const mock = require('mock-require')

// eslint-disable-next-line no-undef
before(() => {
  const json = {
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
  }
  const fixtures = Volume.fromNestedJSON(json, '/fixtures')
  const testFs = ufs.use(fixtures).use(fs)
  mock('fs', testFs)
})
