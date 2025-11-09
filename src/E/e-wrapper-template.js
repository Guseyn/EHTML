import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js?v=4d85ec20'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js?v=e2d7e253'
import evaluateStringWithActionsOnProgress from '#ehtml/evaluateStringWithActionsOnProgress.js?v=c20d640c'
import scrollToHash from '#ehtml/actions/scrollToHash.js?v=e7d61ab5'

export default (node) => {
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
      evaluatedStringWithParamsFromState(
        node.getAttribute('data-src'),
        node.__ehtmlState__,
        node
      )
    ),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParamsFromState(
        node.getAttribute('data-headers') || '{}',
        node.__ehtmlState__,
        node
      )
    )
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    const html = resObj.body
    const wrapperTemplate = node
    const placeholderSelector = wrapperTemplate.getAttribute('data-where-to-place')
    const wayToPlace = wrapperTemplate.getAttribute('data-how-to-place') || 'after' // also possible 'before', 'instead' and 'inside'
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
    } else if (wayToPlace === 'inside') {
      placeholderElement.innerHTML = ''
      placeholderElement.appendChild(wrapperTemplateContentNode)
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
