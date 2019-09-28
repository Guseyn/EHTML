'use strict'

const E = require('./../E')

E(
  'e-page-url',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {
      const urlParams = {}
      const urlPattern = this.getAttribute('data-url-pattern')
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
  },
  true
)
