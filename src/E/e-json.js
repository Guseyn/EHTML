import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import evaluateActionsOnResponse from '#ehtml/evaluateActionsOnResponse.js'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default class EJson extends HTMLElement {
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
    if (this.hasAttribute('data-do-not-run-on-activation')) {
      return
    }

    if (this.hasAttribute('data-use-session-cache')) {
      document.addEventListener('visibilitychange', (event) => {
        if (document.visibilityState === 'visible') {
          this.triggerWithNewSessionCache(
            this.hasAttribute('data-only-update-session-cache-on-visibility-change')
          )
        }
      })

      const navigationType = window.performance.getEntriesByType('navigation')[0].type
      if (navigationType === 'reload') {
        this.triggerWithNewSessionCache()
      } else {
        this.trigger()
      }
    } else {
      this.trigger()
    }
  }

  // Public method (to manually trigger e-json)
  trigger(triggerElm) {
    if (triggerElm) {
      triggerElm.setAttribute('disabled', '')
    }
    const socketName = this.getAttribute('data-socket')
    if (socketName) {
      if (this.hasAttribute('data-use-session-cache')) {
        throw new Error('e-json for web sockets cannot have "data-use-session-cache" attribute')
      }
      return this.#runSocketMode()
    }

    const eventSourceName = this.getAttribute('data-event-source')
    if (eventSourceName) {
      if (this.hasAttribute('data-use-session-cache')) {
        throw new Error('e-json for server sent events cannot have "data-use-session-cache" attribute')
      }
      return this.#runEventSourceMode()
    }

    const cacheAttr = this.getAttribute('data-cache-from')
    if (cacheAttr) {
      const cached = this.#tryCache()
      if (cached) {
        return
      }
    }
    const navigationType = window.performance.getEntriesByType('navigation')[0].type
    if (this.hasAttribute('data-use-session-cache')) {
      if (navigationType === 'reload') {
        this.triggerWithNewSessionCache(true)
      }
    }

    return this.#runAjax(triggerElm)
  }

  // Public method (to manually trigger e-json with new session cache key)
  triggerWithNewSessionCache(onlyUpdateSessionCache = false) {
    if (!this.hasAttribute('data-use-session-cache')) {
      throw new Error('e-json without data-use-session-cache attribute cannot be called with triggerWithNewSessionCache()')
    }
    if (!this.hasAttribute('data-reusable') && !this.hasAttribute('data-only-update-session-cache-on-visibility-change')) {
      throw new Error('e-json with data-use-session-cache must have data-reusable or data-only-update-session-cache-on-visibility-change')
    }
    if (!this.hasAttribute('data-src')) {
      throw new Error('e-json without data-src cannot be called with triggerWithNewSessionCache()')
    }

    const state = getNodeScopedState(this)

    let src = this.getAttribute('data-src')

    const url = encodeURI(
      evaluatedStringWithParamsFromState(src, state, this)
    )

    const sessionCacheKeyName = url

    const allSessionKeysForEJsons = Object.keys({ ...localStorage }).filter(k => k.startsWith('sessionCacheKeyFor'))
    const allSessionKeysForEJsonsMatchedWithSrc = allSessionKeysForEJsons.filter(k => {
      const urlFromSessionKey = k.split('sessionCacheKeyFor')[1].slice(1, -1)

      const srcParts = src.split('?')
      const urlFromSessionKeyParts = urlFromSessionKey.split('?')

      const srcPathParts = srcParts[0].split('/')
      const urlFromSessionKeyPathParts = urlFromSessionKeyParts[0].split('/')

      if (srcPathParts.length !== urlFromSessionKeyPathParts.length) {
        return false
      }
      for (let i = 0; i < srcPathParts.length; i++) {
        if (srcPathParts[i].includes('${')) {
          continue
        }
        if (srcPathParts[i] !== urlFromSessionKeyPathParts[i]) {
          return false
        }
      }

      const srcQuery = srcParts[1]
      const urlFromSessionKeyQuery = urlFromSessionKeyParts[1]

      if (!srcQuery && !urlFromSessionKeyQuery) {
        return true
      }

      if (!srcQuery && urlFromSessionKeyQuery) {
        return false
      }

      if (srcQuery && !urlFromSessionKeyQuery) {
        return false
      }

      const srcQueryParts = srcQuery.split('&')
      const urlFromSessionKeyQueryParts = urlFromSessionKeyQuery.split('&')

      if (srcQueryParts.length !== urlFromSessionKeyQueryParts.length) {
        return false
      }

      for (let j = 0; j < srcQueryParts.length; j++) {
        if (srcQueryParts[j].split('=')[0] !== urlFromSessionKeyQueryParts[j].split('=')[0]) {
          return false
        }
      }

      return true
    })

    allSessionKeysForEJsonsMatchedWithSrc.forEach(k => {
      localStorage.removeItem(k)
    })

    this.#updateSessionCacheKey(sessionCacheKeyName)
    if (!onlyUpdateSessionCache) {
      this.trigger()
    }
  }

  // Public method (to get/generate session cache key manually)
  extractSessionCacheKey() {
    const useSessionCache = this.hasAttribute('data-use-session-cache')
    const isReusable = this.hasAttribute('data-reusable')
    const onlyUpdateSessionCache = this.hasAttribute('data-only-update-session-cache-on-visibility-change')
    if (!useSessionCache || (!isReusable && !onlyUpdateSessionCache)) {
      throw new Error('e-json without data-use-session-cache and data-reusable or data-only-update-session-cache-on-visibility-change cannot extract session cache key')
    }
    const state = getNodeScopedState(this)
    let src = this.getAttribute('data-src')
    if (!src) {
      throw new Error('<e-json> must have data-src when calling extractSessionCacheKey()')
    }
    let url = encodeURI(
      evaluatedStringWithParamsFromState(src, state, this)
    )
    const sessionCacheKeyName = url
    return this.#sessionCacheKey(sessionCacheKeyName)
  }

  #runSocketMode() {
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
      evaluateActionsOnResponse(
        this.getAttribute('data-actions-on-response'),
        this.getAttribute('data-response-name'),
        response,
        this,
        state
      )
    })

    unwrappedChildrenOfParent(this)
  }

  #runEventSourceMode() {
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
        evaluateActionsOnResponse(
          this.getAttribute('data-actions-on-response'),
          this.getAttribute('data-response-name'),
          response,
          this,
          state
        )
      }
    } else {
      eventSource.addEventListener(this.getAttribute('data-event'), (event) => {
        const response = JSON.parse(event.data)
        evaluateActionsOnResponse(
          this.getAttribute('data-actions-on-response'),
          this.getAttribute('data-response-name'),
          response,
          this,
          state
        )
      })
    }

    unwrappedChildrenOfParent(this)
  }

  #tryCache() {
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

    if (!this.hasAttribute('data-reusable')) {
      unwrappedChildrenOfParent(this)
    }
    scrollToHash()

    evaluateActionsOnResponse(
      this.getAttribute('data-actions-on-response'),
      this.getAttribute('data-response-name'),
      obj,
      this,
      state
    )

    return true
  }

  #runAjax(triggerElm) {
    const state = getNodeScopedState(this)

    let src = this.getAttribute('data-src')
    if (!src) {
      throw new Error('<e-json> must have data-src or data-socket or data-event-source')
    }

    let url = encodeURI(
      evaluatedStringWithParamsFromState(src, state, this)
    )

    const headers = evaluatedValueWithParamsFromState(
      this.getAttribute('data-request-headers') || '${{}}',
      state,
      this
    )

    const useSessionCache = this.hasAttribute('data-use-session-cache')
    const isReusable = this.hasAttribute('data-reusable')
    const onlyUpdateSessionCache = this.hasAttribute('data-only-update-session-cache-on-visibility-change')
    if (useSessionCache && !isReusable && !onlyUpdateSessionCache) {
      throw new Error('e-json with data-use-session-cache must have data-reusable')
    }
    if (useSessionCache) {
      const sessionCacheKeyName = url
      const sessionCacheKey = this.#sessionCacheKey(sessionCacheKeyName)
      if (url.includes('?')) {
        url = `${url}&sessionCacheKey=${sessionCacheKey}`
      } else {
        url = `${url}?sessionCacheKey=${sessionCacheKey}`
      }
    }

    const ajaxIcon = this.#resolveIcon()
    if (ajaxIcon) {
      ajaxIcon.style.display = ''
    }

    const progressBar = this.#resolveProgressBar()
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

        scrollToHash()

        if (this.parentElement && !this.hasAttribute('data-reusable')) {
          unwrappedChildrenOfParent(this)
        }

        evaluateActionsOnResponse(
          this.getAttribute('data-actions-on-response'),
          this.getAttribute('data-response-name'),
          responsePayload,
          this,
          state
        )

        if (triggerElm) {
          triggerElm.removeAttribute('disabled')
        }

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

  #resolveProgressBar() {
    const sel = this.getAttribute('data-progress-bar')
    if (!sel) {
      return null
    }
    return document.querySelector(sel)
  }

  #resolveIcon() {
    const sel = this.getAttribute('data-ajax-icon')
    if (!sel) {
      return null
    }
    return document.querySelector(sel)
  }

  #sessionCacheKey(sessionCacheKeyName) {
    if (sessionCacheKeyName && !sessionStorage.getItem('session started')) {
      sessionStorage.setItem('session started', 'true')
      const allSessionKeysForEJsons = Object.keys({ ...localStorage })
        .filter(k => k.startsWith('sessionCacheKeyFor'))
      allSessionKeysForEJsons.forEach(k => {
        localStorage.removeItem(k)
      })
    }
    if (!localStorage.getItem(`sessionCacheKeyFor[${sessionCacheKeyName}]`)) {
      this.#updateSessionCacheKey(sessionCacheKeyName)
    }
    return localStorage.getItem(`sessionCacheKeyFor[${sessionCacheKeyName}]`)
  }

  #updateSessionCacheKey(sessionCacheKeyName) {
    localStorage.setItem(
      `sessionCacheKeyFor[${sessionCacheKeyName}]`,
      ((+new Date).toString(36))
    )
  }
}

customElements.define('e-json', EJson)
