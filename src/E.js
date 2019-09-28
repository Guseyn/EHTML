'use strict'

const StringWithAppliedStorageVariables = require('./util/StringWithAppliedStorageVariables')
const StringWithAppliedUrlParams = require('./util/StringWithAppliedUrlParams')

function E (name, ELEMENT, renderImmediately, options) {
  ELEMENT.prototype.rendered = false
  if (renderImmediately && typeof renderImmediately === 'object') {
    options = renderImmediately
    ELEMENT.prototype.renderImmediately = false
  } else {
    ELEMENT.prototype.renderImmediately = renderImmediately
  }
  ELEMENT.prototype.render = function () {
    if (!this.rendered) {
      if (!this.onRender) {
        throw new Error('render function must be defined')
      }
      this.onRender()
      this.rendered = true
    }
  }
  ELEMENT.prototype.applyStorageValuesAndUrlParamsToAttributes = function () {
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
  ELEMENT.prototype.connectedCallback = function () {
    this.applyStorageValuesAndUrlParamsToAttributes()
    if (!this.renderImmediately) {
      setTimeout(() => {
        this.render()
      })
    } else {
      this.render()
    }
  }
  window.customElements.define(name, ELEMENT, options)
  return ELEMENT
}

module.exports = E
