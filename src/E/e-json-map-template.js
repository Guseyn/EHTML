import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import templateTriggerEventListener from '#ehtml/templateTriggerEventListener.js'
import mapToTemplate from '#ehtml/actions/mapToTemplate.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default class EJsonMapTemplate extends HTMLTemplateElement {
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
    this.addEventListener(
      'ehtml:template-triggered',
      this.onEHTMLTemplateTriggered
    )
  }

  disconnectedCallback() {
    this.removeEventListener(
      'ehtml:template-triggered',
      this.onEHTMLTemplateTriggered
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
    const socketName = this.getAttribute('data-socket')
    if (socketName) {
      return this.runSocketMode()
    }

    const eventSourceName = this.getAttribute('data-event-source')
    if (eventSourceName) {
      return this.runEventSourceMode()
    }

    const cacheAttr = this.getAttribute('data-cache-from')
    if (cacheAttr) {
      const cached = this.tryCache()
      if (cached) {
        return
      }
    }

    return this.runAjax()
  }

  runSocketMode() {
    const state = getNodeScopedState(this)

    const socketName = evaluatedStringWithParamsFromState(
      this.getAttribute('data-socket'),
      state,
      this
    )

    const sockets = window.__EHTML_WEB_SOCKETS__
    if (!sockets || !sockets[socketName]) {
      throw new Error(`socket "${socketName}" is not defined or not opened yet`)
    }

    const socket = sockets[socketName]

    socket.addEventListener('message', event => {
      const response = JSON.parse(event.data)
      mapToTemplate(this, response)
      scrollToHash()
    })
  }

  runEventSourceMode() {
    const state = getNodeScopedState(this)

    const eventSourceName = evaluatedStringWithParamsFromState(
      this.getAttribute('data-event-source'),
      state,
      this
    )

    const eventSources = window.__EHTML_SERVER_EVENT_SOURCES__
    if (!eventSources || !eventSources[eventSourceName]) {
      throw new Error(`eventSource "${eventSourceName}" is not defined or not opened yet`)
    }

    const eventSource = eventSources[eventSourceName]

    if (!this.hasAttribute('data-event')) {
      eventSource.onmessage = (event) => {
        const response = JSON.parse(event.data)
        mapToTemplate(this, response)
        scrollToHash()
      }
    } else {
      eventSource.addEventListener(this.getAttribute('data-event'), (event) => {
        const response = JSON.parse(event.data)
        mapToTemplate(this, response)
        scrollToHash()
      })
    }
  }

  tryCache() {
    const state = getNodeScopedState(this)
    const cacheAttr = this.getAttribute('data-cache-from')

    const evaluated = evaluatedValueWithParamsFromState(
      cacheAttr,
      state,
      this
    )

    if (evaluated === 'undefined' || evaluated === 'null') {
      return false
    }

    const obj = evaluated

    if (!obj) {
      return false
    }

    mapToTemplate(this, obj)
    scrollToHash()

    return true
  }

  runAjax() {
    const state = getNodeScopedState(this)

    const src = this.getAttribute('data-src')
    if (!src) {
      throw new Error('<e-json> must have data-src or data-socket')
    }

    const ajaxIcon = this.resolveIcon()
    if (ajaxIcon) {
      ajaxIcon.style.display = ''
    }

    const progressBar = this.resolveProgressBar()
    if (progressBar) {
      progressBar.max = 100
      progressBar.value = 0
      progressBar.style.display = 'none'
    }

    if (this.hasAttribute('data-actions-on-progress-start')) {
      evaluateActionsOnProgress(
        this.getAttribute('data-actions-on-progress-start'),
        this,
        state
      )
    }

    const url = encodeURI(
      evaluatedStringWithParamsFromState(src, state, this)
    )

    const headers = evaluatedValueWithParamsFromState(
      this.getAttribute('data-request-headers') || '${{}}',
      state,
      this
    )

    responseFromAjaxRequest(
      {
        url: url,
        method: 'GET',
        headers: headers,
        progressEvent: event => {
          if (!progressBar || !event.lengthComputable) {
            return
          }
          progressBar.style.display = ''
          const percent = Math.floor((event.loaded / event.total) * 100)
          progressBar.value = percent
          if (percent === 100) {
            progressBar.style.display = 'none'
          }
        }
      },
      undefined,
      (err, resObj) => {
        if (err) {
          throw err
        }

        if (ajaxIcon) {
          ajaxIcon.style.display = 'none'
        }

        const buffer = resObj.body
        const text = buffer.toString('utf-8', 0, buffer.length)
        const obj = JSON.parse(text)

        const responsePayload = {
          body: obj,
          statusCode: resObj.statusCode,
          headers: resObj.headers
        }

        mapToTemplate(this, response)
        scrollToHash()

        if (this.hasAttribute('data-actions-on-progress-end')) {
          evaluateActionsOnProgress(
            this.getAttribute('data-actions-on-progress-end'),
            this,
            state
          )
        }
      }
    )
  }

  resolveProgressBar() {
    const sel = this.getAttribute('data-progress-bar')
    if (!sel) {
      return null
    }
    return document.querySelector(sel)
  }

  resolveIcon() {
    const sel = this.getAttribute('data-ajax-icon')
    if (!sel) {
      return null
    }
    return document.querySelector(sel)
  }

  onEHTMLTemplateTriggered(event) {
    const template = event?.target ?? this
    const state = event?.detail?.state ?? getNodeScopedState(this)

    templateTriggerEventListener(template, state)
    if (event.target.parentNode && !event.target.hasAttribute('data-reusable')) {
      event.target.parentNode.removeChild(event.target)
    }
  }
}

customElements.define('e-json-map', EJsonMapTemplate, { extends: 'template' })
