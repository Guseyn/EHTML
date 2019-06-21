/* const { AsyncObject } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('@page-libs/dom')
const AttributeWithAppliedLocalStorageVariables = require('./async/AttributeWithAppliedLocalStorageVariables')
const RequestBodyWithAppliedLocalStorageValues = require('./async/RequestBodyWithAppliedLocalStorageValues') */

// TODO: not finished
/* class RequestOptions extends AsyncObject {
  constructor (url, method, headers) {
    super(url, method, headers)
  }

  syncCall () {
    return (url, method, headers) => {
      return {
        url: url,
        method: method,
        headers: headers
      }
    }
  }
}

class CacheWithDataObject extends AsyncObject {
  constructor (cache, name, value) {
    super(cache, name, value)
  }

  syncCall () {
    return (cache, name, value) => {
      cache[name] = value
      return cache
    }
  }
}

class EJSON extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  static get observedAttributes () {
    return ['data-src', 'data-method', 'data-headers', 'data-request-body', 'data-object']
  }

  render () {
    if (!this.rendered) {
      new UnwrappedChildrenOfParent(
        new ElementWithInnerHTML(
          this, new ResponseBody(
            new ResponseFromAjaxRequest(
              new RequestOptions(
                this.getAttribute('data-src'),
                this.getAttribute('data-method'),
                this.getAttribute('data-headers')
              ),
              new RequestBodyWithAppliedLocalStorageValues(
                this.getAttribute('data-request-body')
              )
            )
          )
        )
      ).call()
      this.rendered = true
    }
  }

  connectedCallback () {
    this.render()
  }
}

window.customElements.define('e-json', EJSON) */