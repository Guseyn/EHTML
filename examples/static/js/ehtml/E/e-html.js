import responseFromAjaxRequest from 'ehtml/responseFromAjaxRequest'
import evaluatedStringWithParamsFromState from 'ehtml/evaluatedStringWithParamsFromState'
import evaluateStringWithActionsOnProgress from 'ehtml/evaluateStringWithActionsOnProgress'
import unwrappedChildrenOfParent from 'ehtml/unwrappedChildrenOfParent'
import scrollToHash from 'ehtml/actions/scrollToHash'

export default (node) => {
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-html must have "data-src" attribute')
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
        node.getAttribute('data-request-headers'),
        node.__ehtmlState__,
        node
      ) || '{}'
    )
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    const responseBody = resObj.body
    node.innerHTML = responseBody
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
