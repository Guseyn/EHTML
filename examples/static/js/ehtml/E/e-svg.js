import unwrappedChildrenOfParent from 'ehtml/unwrappedChildrenOfParent.js'
import responseFromAjaxRequest from 'ehtml/responseFromAjaxRequest.js'
import evaluatedStringWithParamsFromState from 'ehtml/evaluatedStringWithParamsFromState.js'
import evaluateStringWithActionsOnProgress from 'ehtml/evaluateStringWithActionsOnProgress.js'
import scrollToHash from 'ehtml/actions/scrollToHash.js'

export default (node) => {
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-svg must have "data-src" attribute')
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
    const svg = resObj.body
    node.innerHTML = svg
    unwrappedChildrenOfParent(node)
    if (node.hasAttribute('data-actions-on-progress-end')) {
      evaluateStringWithActionsOnProgress(
        node.getAttribute('data-actions-on-progress-end'),
        node
      )
    }
    scrollToHash()
  })
}
