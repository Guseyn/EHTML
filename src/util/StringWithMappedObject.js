'use string'

class StringWithMappedObject {
  constructor (str, obj) {
    this.str = str
    this.obj = obj
  }

  value () {
    return this.str.replace(/\$\{([^{}]+|\S*)\}/g, (match, p1, offset, string) => {
      try {
        const res = this.valueOf(this.obj, p1.split('.'))
        if (typeof res === 'object') {
          return JSON.stringify(res)
        }
        return res
      } catch (e) {
        return match
      }
    })
  }

  valueOf (obj, pathParts, index = 0) {
    if (pathParts.length - 1 === index) {
      return obj[pathParts[index]]
    } else {
      return this.valueOf(obj[pathParts[index]], pathParts, index + 1)
    }
  }
}

module.exports = StringWithMappedObject
