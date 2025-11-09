import responseFromAjaxRequest from 'ehtml/responseFromAjaxRequest.js'
import unwrappedChildrenOfParent from 'ehtml/unwrappedChildrenOfParent.js'
import evaluatedStringWithParamsFromState from 'ehtml/evaluatedStringWithParamsFromState.js'
import evaluateStringWithActionsOnProgress from 'ehtml/evaluateStringWithActionsOnProgress.js'
import scrollToHash from 'ehtml/actions/scrollToHash.js'
import * as showdown from 'ehtml/third-party/showdown.min.js'
import showdownHighlight from 'ehtml/third-party/showdown-highlight.js'
import showdownKatex from 'ehtml/third-party/showdown-katex/showdown-katex.js'

export default (node) => {
  const extensions = window.__ehtmlShowdownExtensions__ || []
  if (node.getAttribute('data-apply-code-highlighting') && showdownHighlight) {
    extensions.push(
      showdownHighlight({
        // Whether to add the classes to the <pre> tag, default is false
        pre: true,
        // Whether to use hljs' auto language detection, default is true
        auto_detection: true
      })
    )
  }
  if (node.getAttribute('data-apply-latex') && showdownKatex) {
    extensions.push(
      showdownKatex({
        displayMode: true,
        throwOnError: false, // allows katex to fail silently
        errorColor: '#ff0000',
        delimiters: [
          { left: '$$', right: '$$', display: false },
          { left: '~', right: '~', display: false, asciimath: true }
        ]
      })
    )
  }
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }

  if (!node.hasAttribute('data-src')) {
    throw new Error('e-markdown must have "data-src" attribute')
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
    if (showdown) {
      showdown.setFlavor('github')
      node.innerHTML = new showdown.Converter({
        tables: true,
        tasklists: true,
        simpleLineBreaks: true,
        emoji: true,
        moreStyling: true,
        github: true,
        extensions: extensions
      }).makeHtml(resObj.body)
    } else {
      node.innerHTML = resObj.body
    }
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
