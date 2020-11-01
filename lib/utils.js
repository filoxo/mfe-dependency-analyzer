const { isPromise, isRegExp } = require('util').types

module.exports.is = {
  func(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
  },
  string(s) {
    return Object.prototype.toString.call(s) === '[object String]'
  },
  array(a) {
    return Array.isArray(a)
  },
  promise: isPromise,
  regex: isRegExp,
}
