'use strict'

const E = require('./E')

class EPAGE_URL extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    const urlParams = {}
    const urlPattern = this.node.getAttribute('data-url-pattern')
    const locationUrl = window.location.pathname + window.location.search
    const parsedUrlPattern = this.parsedUrl(urlPattern)
    const parsedLocationUrl = this.parsedUrl(locationUrl)
    parsedUrlPattern.forEach(
      (part, index) => {
        if (/^\{([^{}\s.]+)}$/g.test(part)) {
          urlParams[/^\{([^{}\s.]+)}$/g.exec(part)[1]] = parsedLocationUrl[index]
        }
      }
    )
    window.urlParams = urlParams
  }

  parsedUrl (url) {
    const urlParts = url.split(/\?/g)
    const beforeQuery = urlParts[0] || ''
    const afterQuery = urlParts[1] || ''
    return beforeQuery
      .split(/\//g)
      .concat(
        afterQuery
          .split(/&?[^&{}\s.]+=/g)
      )
      .filter(part => part !== '')
  }
}

module.exports = EPAGE_URL
