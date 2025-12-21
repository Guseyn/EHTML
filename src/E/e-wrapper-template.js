import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default class EWrapperTemplate extends HTMLTemplateElement {
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
      throw new Error('e-wrapper template must have "data-src" attribute')
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

        this.insert(resObj.body)

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

  insert(html) {
    // Create fragment
    const fetched = document.createElement('template')
    fetched.innerHTML = html
    const fetchedContent = fetched.content.cloneNode(true)

    // Step 1: Insert fetched HTML into DOM BEFORE manipulation
    this.parentNode.insertBefore(fetchedContent, this)

    // Step 2: Look for placeholder in real DOM
    const placeholderSelector = this.getAttribute('data-where-to-place')
    const how = this.getAttribute('data-how-to-place') || 'after'

    const placeholder = this.parentNode.querySelector(placeholderSelector)

    if (!placeholder) {
      throw new Error(
        `element not found by selector "${placeholderSelector}" in data-where-to-place`
      )
    }

    // Step 3: Clone wrapper content
    const wrapperContent = this.content.cloneNode(true)

    // Step 4: Insert wrapper content into real DOM
    if (how === 'before') {
      placeholder.parentNode.insertBefore(wrapperContent, placeholder)
    } else if (how === 'after') {
      if (placeholder.nextSibling) {
        placeholder.parentNode.insertBefore(wrapperContent, placeholder.nextSibling)
      } else {
        placeholder.parentNode.appendChild(wrapperContent)
      }
    } else if (how === 'inside') {
      placeholder.innerHTML = ''
      placeholder.appendChild(wrapperContent)
    } else {
      // instead
      placeholder.parentNode.replaceChild(wrapperContent, placeholder)
    }

    // Step 5: Remove original wrapper template
    this.parentNode.removeChild(this)
  }
}

customElements.define('e-wrapper', EWrapperTemplate, { extends: 'template' })
