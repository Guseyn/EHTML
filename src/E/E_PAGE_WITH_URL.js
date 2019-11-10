'use strict'

const { ElementWithMappedObjectAndAppliedVariables } = require('./../dom/exports')
const E = require('./E')

class E_PAGE_WITH_URL extends E {
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
    this.node.parentNode.replaceChild(
      new ElementWithMappedObjectAndAppliedVariables(
        this.node.content.cloneNode(true)
      ).value(), this.node
    )
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

module.exports = E_PAGE_WITH_URL
