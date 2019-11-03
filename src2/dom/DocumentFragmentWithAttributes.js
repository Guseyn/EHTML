'use strict'

class DocumentFragmentWithAttributes {
  constructor (fragment, attributes) {
    fragment = fragment || document.createDocumentFragment()
    fragment.attributes = attributes || []
    fragment.setAttribute = (name, value) => {
      let isSet = false
      for (let i = 0; i < fragment.attributes.length; i++) {
        if (fragment.attributes[i].name === name) {
          fragment.attributes[i].value = value
          isSet = true
          break
        }
      }
      if (!isSet) {
        fragment.attributes.push({
          name: name,
          value: value
        })
      }
    }
    fragment.getAttribute = (name) => {
      for (let i = 0; i < fragment.attributes.length; i++) {
        if (fragment.attributes[i].name === name) {
          return fragment.attributes[i].value
        }
      }
      return null
    }
    return fragment
  }
}

module.exports = DocumentFragmentWithAttributes
