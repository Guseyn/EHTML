'use strict'

const StringWithAppliedStorageVariables = require('./util/StringWithAppliedStorageVariables')
const StringWithAppliedUrlParams = require('./util/StringWithAppliedUrlParams')

class E extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  connectedCallback () {
    this.applyStorageValuesAndUrlParamsToAttributes()
    setTimeout(() => {
      if (!this.rendered) {
        this.onRender()
        this.rendered = true
      }
    })
  }

  onRender () {
    throw new Error('render function must be overridden')
  }

  applyStorageValuesAndUrlParamsToAttributes () {
    for (let i = 0; i < this.attributes.length; i++) {
      if (this.attributes[i].name !== 'data-actions') {
        this.setAttribute(
          this.attributes[i].name,
          new StringWithAppliedStorageVariables(
            new StringWithAppliedUrlParams(
              this.attributes[i].value
            ).value()
          ).value()
        )
      }
    }
  }
}

module.exports = E
