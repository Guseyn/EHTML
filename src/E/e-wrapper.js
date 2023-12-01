const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')

module.exports = (node) => {
  responseFromAjaxRequest({
    url: encodeURI(node.getAttribute('data-src')),
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
    const wrapperTemplateReplacementContentNode = document.importNode(wrapperTemplateReplacement.content, true)
    wrapperTemplate.parentNode.insertBefore(wrapperTemplateReplacementContentNode, wrapperTemplate)
    const placeholderElement = wrapperTemplate.parentNode.querySelector(placeholderSelector)
    if (!placeholderElement) {
      throw new Error('element is not found by the selector in the attribute "data-where-to-place"')
    }
    const wrapperTemplateContentNode = document.importNode(wrapperTemplate.content, true)
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
  })
}
