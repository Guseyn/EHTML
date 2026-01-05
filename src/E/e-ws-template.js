import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import evaluateActionsOnOpenConnection from '#ehtml/evaluateActionsOnOpenConnection.js'
import evaluateActionsOnCloseConnection from '#ehtml/evaluateActionsOnCloseConnection.js'

export default class EWs extends HTMLTemplateElement {
  constructor() {
    super()
    this.ehtmlActivated = false
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
      throw new Error('e-ws must have "data-src" attribute')
    }

    if (!this.hasAttribute('data-socket-name')) {
      throw new Error('e-ws must have "data-socket-name" attribute')
    }

    const socketUrl = evaluatedStringWithParamsFromState(
      this.getAttribute('data-src'),
      state,
      this
    )

    const socketName = this.getAttribute('data-socket-name')

    const connectionIconSelector = this.getAttribute('data-connection-icon')
    const connectionIcon = connectionIconSelector
      ? document.querySelector(connectionIconSelector)
      : null

    if (connectionIcon) {
      connectionIcon.style.display = ''
    }

    const socket = new WebSocket(socketUrl)

    // global EHTML storage
    window.__EHTML_WEB_SOCKETS__ =
      window.__EHTML_WEB_SOCKETS__ || {}

    window.__EHTML_WEB_SOCKETS__[socketName] = socket

    socket.addEventListener('open', event => {
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

      // Replace <template is="e-ws"> with its content
      this.parentNode.replaceChild(
        this.content.cloneNode(true),
        this
      )
    })

    socket.addEventListener('close', event => {
      if (this.hasAttribute('data-actions-on-close-connection')) {
        evaluateActionsOnCloseConnection(
          this.getAttribute('data-actions-on-close-connection'),
          event,
          this,
          state
        )
      }
    })
  }
}

customElements.define('e-ws', EWs, { extends: 'template' })
