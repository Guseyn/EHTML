import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default class ESvg extends HTMLElement {

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
      throw new Error('<e-svg> must have "data-src" attribute')
    }

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

        const svgText = resObj.body
        this.innerHTML = svgText

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

customElements.define('e-svg', ESvg)
