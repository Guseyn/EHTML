'use strict'

const E = require('./E')

class E_PAGE_WITH_URL extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    const urlParams = {}
    const urlPattern = this.node.getAttribute('data-url-pattern')
    const parsedUrlPattern = this.parsedUrlPattern(urlPattern)
    const locationPath = window.location.pathname
    const locationSearch = window.location.search
    const localtionPathParts = locationPath.split(/\//g).filter(part => part !== '')
    const locationRequestParams = this.requestParamsOfLocationSearch(locationSearch)
    parsedUrlPattern.pathVariables.forEach((variable, index) => {
      if (/\{([^{}\s.]+)}/gm.test(variable)) {
        urlParams[/\{([^{}\s.]+)}/gm.exec(variable)[1]] = localtionPathParts[index]
      }
    })
    parsedUrlPattern.requestParams.forEach(param => {
      if (/\{([^{}\s.]+)}/gm.test(param)) {
        const key = /\{([^{}\s.]+)}/gm.exec(param)[1]
        urlParams[key] = locationRequestParams[key]
      }
    })
    window.urlParams = urlParams
    this.node.parentNode.replaceChild(
      document.importNode(this.node.content, true), this.node
    )
  }

  parsedUrlPattern (url) {
    const splittedByQuery = url.split(/\?/g)
    const beforeQuery = splittedByQuery[0]
    const afterQuery = splittedByQuery[1]
    return {
      pathVariables: beforeQuery ? beforeQuery.split(/\//g).filter(part => part !== '') : [],
      requestParams: afterQuery ? afterQuery.split(/&/g).filter(part => part !== '') : []
    }
  }

  requestParamsOfLocationSearch (locationSearch) {
    const requestParams = { }
    const searchPart = locationSearch.split('?')[1]
    if (searchPart) {
      searchPart.split('&').forEach(exp => {
        const parts = exp.split('=')
        if (parts[1] !== undefined) {
          requestParams[parts[0]] = parts[1]
        }
      })
    }
    return requestParams
  }
}

module.exports = E_PAGE_WITH_URL
