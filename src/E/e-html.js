import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default class Ehtml extends HTMLElement {

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

    if (this.hasAttribute('data-actions-on-progress-start')) {
      evaluateActionsOnProgress(
        this.getAttribute('data-actions-on-progress-start'),
        this,
        state
      )
    }

    if (!this.hasAttribute('data-src')) {
      throw new Error('<e-html> must have "data-src" attribute')
    }

    const src = evaluatedStringWithParamsFromState(
      this.getAttribute('data-src'),
      state,
      this
    )

    const headers = evaluatedValueWithParamsFromState(
      this.getAttribute('data-request-headers') || '${{}}',
      state,
      this
    )

    responseFromAjaxRequest(
      {
        url: encodeURI(src),
        method: 'GET',
        headers: headers
      },
      undefined,
      (err, resObj) => {
        if (err) {
          throw err
        }

        const buffer = resObj.body
        const text = buffer.toString('utf-8', 0, buffer.length)

        this.innerHTML = text
        unwrappedChildrenOfParent(this)

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

customElements.define('e-html', Ehtml)
