const { isPromise, isRegExp } = require('util').types

module.exports.is = {
  func: (obj) => !!(obj && obj.constructor && obj.call && obj.apply),
  string: (s) => Object.prototype.toString.call(s) === '[object String]',
  array: Array.isArray,
  promise: isPromise,
  regex: isRegExp,
}
