'use strcit'

const { browserified } = require('@page-libs/cutie')
const { TheSameObjectWithValue } = browserified(require('@cuties/object'))
const EAttributes = require('./EAttributes')
const EActions = require('./EActions')

class EElement {
  constructor (elm, observedAttributes, supportedActions) {
    this.elm = elm
    this.elm.attrs = new EAttributes(this.elm)
    this.elm.observedAttributes = observedAttributes
    this.elm.supportedActions = supportedActions
    this.elm.rendered = false
    this.elm.attrValue = this.attrValue
    this.elm.appliedActions = this.appliedActions
    this.elm.connectedCallback = this.connectedCallback
    return this.elm
  }

  attrValue (name) {
    return this.elm.attrs.value(name)
  }

  appliedActions (value) {
    const OBJ = {}
    return new TheSameObjectWithValue(
      OBJ,
      this.elm.attrs.value('data-object') || 'OBJECT_NAME',
      value
    ).after(
      new EActions(
        this.elm.tagName,
        this.elm.attrs.value('data-object'),
        this.elm.supportedActions
      ).asAsyncTree(OBJ)
    )
  }

  connectedCallback (render) {
    this.attrs.each(attr => {
      if (!attr.is('data-actions')) {
        attr.applyStorageVariables()
      }
    })
    setTimeout(() => {
      if (!this.elm.rendered) {
        render()
        this.elm.rendered = true
      }
    })
  }
}

module.exports = EElement
