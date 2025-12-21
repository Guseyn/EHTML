import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'
import * as showdown from '#ehtml/third-party/showdown.min.js'
import showdownHighlight from '#ehtml/third-party/showdown-highlight.js'
import showdownKatex from '#ehtml/third-party/showdown-katex/showdown-katex.js'

export default class EMarkdown extends HTMLElement {
  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener('ehtml:activated', this.onEHTMLActivated, { once: true })
  }

  onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    this.run()
  }

  run() {
    const state = getNodeScopedState(this)

    // --- Progress start ---
    if (this.hasAttribute('data-actions-on-progress-start')) {
      evaluateActionsOnProgress(
        this.getAttribute('data-actions-on-progress-start'),
        this,
        state
      )
    }

    if (!this.hasAttribute('data-src')) {
      throw new Error('e-markdown must have "data-src" attribute')
    }

    // --- Resolve showdown extensions (global registry) ---
    const extensions = window.__EHTML_SHOWDOWN_EXTENSIONS__ || []

    // Code highlighting extension
    if (this.hasAttribute('data-apply-code-highlighting') && showdownHighlight) {
      extensions.push(
        showdownHighlight({
          pre: true,
          auto_detection: true
        })
      )
    }

    // LaTeX / KaTeX extension
    if (this.hasAttribute('data-apply-latex') && showdownKatex) {
      extensions.push(
        showdownKatex({
          displayMode: true,
          throwOnError: false,
          errorColor: '#ff0000',
          delimiters: [
            { left: '$$', right: '$$', display: false },
            { left: '~', right: '~', display: false, asciimath: true }
          ]
        })
      )
    }

    // --- AJAX request ---
    const url = encodeURI(
      evaluatedStringWithParamsFromState(
        this.getAttribute('data-src'),
        state,
        this
      )
    )

    const headers = evaluatedValueWithParamsFromState(
      this.getAttribute('data-headers') || '${{}}',
      state,
      this
    )

    responseFromAjaxRequest(
      {
        url: url,
        method: 'GET',
        headers: headers
      },
      undefined,
      (err, resObj) => {
        if (err) {
          throw err
        }

        const markdown = resObj.body

        // --- Render markdown ---
        if (showdown) {
          showdown.setFlavor('github')
          const converter = new showdown.Converter({
            tables: true,
            tasklists: true,
            simpleLineBreaks: true,
            emoji: true,
            moreStyling: true,
            github: true,
            extensions: extensions
          })
          this.innerHTML = converter.makeHtml(markdown)
        } else {
          this.innerHTML = markdown
        }

        // Remove <e-markdown> wrapper
        unwrappedChildrenOfParent(this)

        // --- Progress end ---
        if (this.hasAttribute('data-actions-on-progress-end')) {
          evaluateActionsOnProgress(
            this.getAttribute('data-actions-on-progress-end'),
            this,
            state
          )
        }

        scrollToHash()
      }
    )
  }
}

customElements.define('e-markdown', EMarkdown)
