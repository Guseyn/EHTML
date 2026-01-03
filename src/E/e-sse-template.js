import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import evaluateActionsOnOpenConnection from '#ehtml/evaluateActionsOnOpenConnection.js'
import evaluateActionsOnCloseConnection from '#ehtml/evaluateActionsOnCloseConnection.js'

export default class ESse extends HTMLTemplateElement {
  constructor() {
    super()
    this.ehtmlActivated = false
    this.eventSourceName = null
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      this.onEHTMLActivated,
      { once: true }
    )
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

    if (!this.hasAttribute('data-src')) {
      throw new Error('e-sse must have "data-src" attribute')
    }

    if (!this.hasAttribute('data-event-source-name')) {
      throw new Error('e-sse must have "data-event-source-name" attribute')
    }

    const eventSourceUrl = evaluatedStringWithParamsFromState(
      this.getAttribute('data-src'),
      state,
      this
    )

    const eventSourceName = evaluatedStringWithParamsFromState(
      this.getAttribute('data-event-source-name'),
      state,
      this
    )

    this.eventSourceName = eventSourceName

    const connectionIconSelector = this.getAttribute('data-connection-icon')
    const connectionIcon = connectionIconSelector
      ? document.querySelector(connectionIconSelector)
      : null

    if (connectionIcon) {
      connectionIcon.style.display = ''
    }

    const eventSource = new EventSource(eventSourceUrl, {
      withCredentials: (
        this.hasAttribute('data-with-credentials') &&
        this.getAttribute('data-with-credentials') === 'true'
      ) ? true
        : false
    })

    // global EHTML storage
    window.__EHTML_SERVER_EVENT_SOURCES__ =
      window.__EHTML_SERVER_EVENT_SOURCES__ || {}

    window.__EHTML_SERVER_EVENT_SOURCES__[eventSourceName] = eventSource

    eventSource.addEventListener('open', event => {
      if (connectionIcon) {
        connectionIcon.style.display = 'none'
      }

      if (this.hasAttribute('data-actions-on-open-connection')) {
        evaluateActionsOnOpenConnection(
          this.getAttribute('data-actions-on-open-connection'),
          event,
          this,
          state
        )
      }

      // Replace <template is="e-sse"> with its content
      this.parentNode.replaceChild(
        this.content.cloneNode(true),
        this
      )
    })
  }
}

customElements.define('e-sse', ESse, { extends: 'template' })
