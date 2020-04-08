'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ReleasedWrapperTemplateWithInnerContent extends AsyncObject {
  constructor (html, wrapperTemplate) {
    super(html, wrapperTemplate)
  }

  syncCall () {
    return (html, wrapperTemplate) => {
      const placeholderSelector = wrapperTemplate.getAttribute('data-place-into')
      const wayToPlace = wrapperTemplate.getAttribute('data-how-to-place') || 'after' // also possible 'before' and 'instead'
      const wrapperTemplateReplacement = document.createElement('template')
      wrapperTemplateReplacement.innerHTML = html
      const wrapperTemplateReplacementContentNode = document.importNode(wrapperTemplateReplacement.content, true)
      wrapperTemplate.parentNode.insertBefore(wrapperTemplateReplacementContentNode, wrapperTemplate)
      const placeholderElement = wrapperTemplate.parentNode.querySelector(placeholderSelector)
      if (!placeholderElement) {
        throw new Error('element is not found by the selector in the attribute "data-place-into"')
      }
      const wrapperTemplateContentNode = document.importNode(wrapperTemplate.content, true)
      if (wayToPlace === 'before') {
        placeholderElement.prepend(wrapperTemplateContentNode)
      } else if (wayToPlace === 'after') {
        placeholderElement.append(wrapperTemplateContentNode)
      } else {
        placeholderElement.parentNode.replaceChild(wrapperTemplateContentNode, placeholderElement)
      }
      return wrapperTemplateContentNode
    }
  }
}

module.exports = ReleasedWrapperTemplateWithInnerContent
