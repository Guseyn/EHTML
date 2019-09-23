'use strict'

const StringWithAppliedStorageVariables = require('./util/StringWithAppliedStorageVariables')
const StringWithAppliedUrlParams = require('./util/StringWithAppliedUrlParams')

class E extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
    this.renderImmediately = false
  }

  connectedCallback () {
    this.applyStorageValuesAndUrlParamsToAttributes()
    console.log(this.childNodes)
    if (!this.renderImmediately) {
      setTimeout(() => {
        if (!this.rendered) {
          this.onRender()
          this.rendered = true
          console.log(this.childNodes)
        }
      })
    } else if (!this.rendered) {
      this.onRender()
      this.rendered = true  
    }
  }

  onRender () {
    throw new Error('render function must be overridden')
  }

  applyStorageValuesAndUrlParamsToAttributes () {
    for (let i = 0; i < this.attributes.length; i++) {
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

module.exports = E
