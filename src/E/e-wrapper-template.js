const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const scrollToHash = require('./../actions/scrollToHash')

module.exports = (node) => {
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-wrapper template must have "data-src" attribute')
  }
  responseFromAjaxRequest({
    url: encodeURI(
      evaluatedStringWithParams(
        node.getAttribute('data-src')
      )
    ),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParams(
        node.getAttribute('data-headers') || '{}'
      )
    )
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    const html = resObj.body
    const wrapperTemplate = node
    const placeholderSelector = wrapperTemplate.getAttribute('data-where-to-place')
    const wayToPlace = wrapperTemplate.getAttribute('data-how-to-place') || 'after' // also possible 'before' and 'instead'
    const wrapperTemplateReplacement = document.createElement('template')
    wrapperTemplateReplacement.innerHTML = html
    const wrapperTemplateReplacementContentNode = wrapperTemplateReplacement.content.cloneNode(true)
    wrapperTemplate.parentNode.insertBefore(wrapperTemplateReplacementContentNode, wrapperTemplate)
    const placeholderElement = wrapperTemplate.parentNode.querySelector(placeholderSelector)
    if (!placeholderElement) {
      throw new Error('element is not found by the selector in the attribute "data-where-to-place"')
    }
    const wrapperTemplateContentNode = wrapperTemplate.content.cloneNode(true)
    if (wayToPlace === 'before') {
      placeholderElement.parentNode.insertBefore(wrapperTemplateContentNode, placeholderElement)
    } else if (wayToPlace === 'after') {
      if (placeholderElement.nextSibling) {
        placeholderElement.parentNode.insertBefore(
          wrapperTemplateContentNode, placeholderElement.nextSibling
        )
      } else {
        placeholderElement.parentNode.append(wrapperTemplateContentNode)
      }
    } else {
      placeholderElement.parentNode.replaceChild(wrapperTemplateContentNode, placeholderElement)
    }
    node.parentNode.removeChild(node)
    if (node.hasAttribute('data-actions-on-progress-end')) {
      evaluateStringWithActionsOnProgress(
        node.getAttribute('data-actions-on-progress-end'),
        node
      )
    }
    scrollToHash()
  })
}
