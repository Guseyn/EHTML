import getNodeScopedState from '#ehtml/getNodeScopedState.js?v=41ab2bfa'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js?v=98b3528d'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js?v=b4193065'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js?v=01fa3e7e'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js?v=01fa3e7e'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js?v=c7f83d7b'
import scrollToHash from '#ehtml/actions/scrollToHash.js?v=e7d61ab5'
import prettyHtml from '#ehtml/third-party/json-pretty-html.js?v=acd8d719'

export default class EJsonView extends HTMLElement {

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
      throw new Error('e-json-view must have "data-src" attribute')
    }

    const src = evaluatedStringWithParamsFromState(
      this.getAttribute('data-src'),
      state,
      this
    )

    const headers = evaluatedValueWithParamsFromState(
      this.getAttribute('data-headers') || '{}',
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
        const obj = JSON.parse(text)

        this.innerHTML = prettyHtml(obj)

        // unwrap <e-json-view> so only pretty HTML remains
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

customElements.define('e-json-view', EJsonView)
