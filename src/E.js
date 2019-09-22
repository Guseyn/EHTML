'use strict'

const StringWithAppliedStorageVariables = require('./util/StringWithAppliedStorageVariables')
const StringWithAppliedUrlParams = require('./util/StringWithAppliedUrlParams')

class E extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  onRender () {
    throw new Error('render function must be overridden')
  }

  applyStorageValuesToAttributes () {
    for (let i = 0; i < this.attributes.length; i++) {
      if (this.attributes[i].name !== 'data-actions') {
        this.setAttribute(
          this.attributes[i].name,
          new StringWithAppliedStorageVariables(
            this.attributes[i].value
          ).value()
        )
      }
    }
  }

  applyUrlParamsToAttributes () {
    for (let i = 0; i < this.attributes.length; i++) {
      if (this.attributes[i].name !== 'data-actions') {
        this.setAttribute(
          this.attributes[i].name,
          new StringWithAppliedUrlParams(
            this.attributes[i].value
          ).value()
        )
      }
    }
  }

  connectedCallback () {
    this.applyStorageValuesToAttributes()
    setTimeout(() => {
      if (!this.rendered) {
        this.onRender()
        this.rendered = true
      }
    })
  }
}

module.exports = E
