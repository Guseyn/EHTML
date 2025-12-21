import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default class EPageWithUrl extends HTMLTemplateElement {
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
    const urlPattern = this.getAttribute('data-url-pattern')
    if (!urlPattern) {
      throw new Error('<template is="e-page-with-url"> must have data-url-pattern')
    }

    // Build global urlParams
    window.urlParams = this.__constructedUrlParams(urlPattern, window.location)

    // Replace template with its content
    this.parentNode.replaceChild(
      this.content.cloneNode(true),
      this
    )

    scrollToHash()
  }

  __constructedUrlParams(urlPattern, windowLocation) {
    const urlParams = {}

    const parsedUrl = this.__parsedUrlPattern(urlPattern)
    const locationPath = windowLocation.pathname
    const locationSearch = windowLocation.search

    const pathParts = locationPath.split(/\//g).filter(x => x !== '')
    const requestParams = this.__requestParamsOfLocationSearch(locationSearch)

    parsedUrl.pathVariables.forEach((variable, index) => {
      if (/\{([^{}\s.]+)}/gm.test(variable)) {
        const key = /\{([^{}\s.]+)}/gm.exec(variable)[1]
        urlParams[key] = pathParts[index]
      }
    })

    parsedUrl.requestParams.forEach(param => {
      if (/\{([^{}\s.]+)}/gm.test(param)) {
        const key = /\{([^{}\s.]+)}/gm.exec(param)[1]
        urlParams[key] = requestParams[key]
      }
    })

    if (windowLocation.hash) {
      urlParams['hash'] = windowLocation.hash.split('#')[1]
    }

    return urlParams
  }

  __parsedUrlPattern(url) {
    const split = url.split('?')
    const beforeQuery = split[0]
    const afterQuery = split[1]

    return {
      pathVariables: beforeQuery
        ? beforeQuery.split('/').filter(x => x !== '')
        : [],
      requestParams: afterQuery
        ? afterQuery.split('&').filter(x => x !== '')
        : []
    }
  }

  __requestParamsOfLocationSearch(locationSearch) {
    const params = {}
    const searchPart = locationSearch.split('?')[1]
    if (!searchPart) {
      return params
    }

    searchPart.split('&').forEach(exp => {
      const parts = exp.split('=')
      if (parts[1] !== undefined) {
        params[parts[0]] = parts[1]
      }
    })

    return params
  }
}

customElements.define('e-page-with-url', EPageWithUrl, { extends: 'template' })
