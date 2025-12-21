import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default (node) => {
  const urlPattern = node.getAttribute('data-url-pattern')
  window.urlParams = constructedUrlParams(urlPattern, window.location)
  node.parentNode.replaceChild(
    node.content.cloneNode(true), node
  )
  scrollToHash()
}

function constructedUrlParams (urlPattern, windowLocation) {
  const urlParams = {}
  const parsedUrlPatternValue = parsedUrlPattern(urlPattern)
  const locationPath = windowLocation.pathname
  const locationSearch = windowLocation.search
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
  if (windowLocation.hash) {
    urlParams['hash'] = windowLocation.hash.split('#')[1]
  }
  return urlParams
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
