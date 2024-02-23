const scrollToHash = require('./../actions/scrollToHash')

module.exports = (node) => {
  const urlParams = {}
  const urlPattern = node.getAttribute('data-url-pattern')
  const parsedUrlPatternValue = parsedUrlPattern(urlPattern)
  const locationPath = window.location.pathname
  const locationSearch = window.location.search
  const localtionPathParts = locationPath.split(/\//g).filter(part => part !== '')
  const locationRequestParams = requestParamsOfLocationSearch(locationSearch)
  parsedUrlPatternValue.pathVariables.forEach((variable, index) => {
    if (/\{([^{}\s.]+)}/gm.test(variable)) {
      urlParams[/\{([^{}\s.]+)}/gm.exec(variable)[1]] = localtionPathParts[index]
    }
  })
  parsedUrlPatternValue.requestParams.forEach(param => {
    if (/\{([^{}\s.]+)}/gm.test(param)) {
      const key = /\{([^{}\s.]+)}/gm.exec(param)[1]
      urlParams[key] = locationRequestParams[key]
    }
  })
  urlParams.hash = window.location.hash.substr(1)
  window.urlParams = urlParams
  node.parentNode.replaceChild(
    document.importNode(node.content, true), node
  )
  scrollToHash()
}

function parsedUrlPattern (url) {
  const splittedByQuery = url.split(/\?/g)
  const beforeQuery = splittedByQuery[0]
  const afterQuery = splittedByQuery[1]
  return {
    pathVariables: beforeQuery ? beforeQuery.split(/\//g).filter(part => part !== '') : [],
    requestParams: afterQuery ? afterQuery.split(/&/g).filter(part => part !== '') : []
  }
}

function requestParamsOfLocationSearch (locationSearch) {
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
