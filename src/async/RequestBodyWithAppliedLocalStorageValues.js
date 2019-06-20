const { AsyncObject } = require('@page-libs/cutie')

class RequestBodyWithAppliedLocalStorageValues extends AsyncObject {
  constructor (body) {
    super(body)
  }

  syncCall () {
    return (body) => {
      return this.bodyWithAppliedLocalStorageValues(body)
    }
  }

  bodyWithAppliedLocalStorageValues (body) {
    if (this.isObject(body)) {
      Object.keys(body).forEach(key => {
        body[key] = this.bodyWithAppliedLocalStorageValues(body[key])
      })
    } else if (this.isArray(body)) {
      body.forEach((value, index) => {
        body[index] = this.bodyWithAppliedLocalStorageValues(body[index])
      })
    } else if (this.isString(body)) {
      body = body.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
        return window.localStorage.getItem(p1)
      })
    }
    return body
  }

  isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object
  }

  isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array
  }

  isString (value) {
    return typeof value === 'string' || value instanceof String
  }
}

module.exports = RequestBodyWithAppliedLocalStorageValues
