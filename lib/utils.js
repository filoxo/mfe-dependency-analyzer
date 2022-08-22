const { isPromise, isRegExp } = require('util').types

const is = {
  func: (obj) => !!(obj && obj.constructor && obj.call && obj.apply),
  string: (s) => Object.prototype.toString.call(s) === '[object String]',
  array: Array.isArray,
  promise: isPromise,
  regex: isRegExp,
}

const uniq = (arr) => [...new Set(arr)]

module.exports = {
  is,
  uniq,
}
