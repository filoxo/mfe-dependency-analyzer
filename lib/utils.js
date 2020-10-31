const { isPromise, isRegExp } = require('util').types

module.exports = {
  isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
  },
  isString(s) {
    return Object.prototype.toString.call(s) === '[object String]'
  },
  isArray(a) {
    return Array.isArray(a)
  },
  isPromise,
  isRegExp,
}
