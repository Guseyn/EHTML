const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')
const evaluatedStringWithParamsFromState = require('./../evaluatedStringWithParamsFromState')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const scrollToHash = require('./../actions/scrollToHash')
const showdown = require('showdown')

let showdownHighlight
let showdownKatex

// eslint-disable-next-line  no-undef
if (!LIGHT_VERSION) {
  showdownHighlight = require('showdown-highlight')
  showdownKatex = require('showdown-katex')
}

module.exports = (node) => {
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
