import getNodeScopedState from '#ehtml/getNodeScopedState.js?v=41ab2bfa'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js?v=b4193065'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js?v=ae379b8c'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js?v=33eb829e'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js?v=6d32193e'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js?v=b4513dec'
import scrollToHash from '#ehtml/actions/scrollToHash.js?v=e7d61ab5'
import * as showdown from '#ehtml/third-party/showdown.min.js?v=8e1f0558'
import showdownHighlight from '#ehtml/third-party/showdown-highlight.js?v=41419cd4'
import showdownKatex from '#ehtml/third-party/showdown-katex/showdown-katex.js?v=088647e7'

export default class EMarkdown extends HTMLElement {
  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      this.#onEHTMLActivated,
      { once: true }
    )
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    this.#run()
  }

  #run() {
    const state = getNodeScopedState(this)

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

    if (this.internalState) {
      this.renderMarkdown(this.internalState, extensions)
      return
    }

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

        this.renderMarkdown(markdown, extensions)

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

  renderMarkdown(markdown, extensions) {
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
  }
}

customElements.define('e-markdown', EMarkdown)
