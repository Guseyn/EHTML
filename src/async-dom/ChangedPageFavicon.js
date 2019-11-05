'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ChangedPageFavicon extends AsyncObject {
  constructor (doc, favicon, ajax) {
    super(doc, favicon, ajax)
  }

  syncCall () {
    return (doc, favicon, ajax) => {
      if (favicon) {
        const oldLink = document.querySelector("link[rel*='icon']")
        const newLink = document.createElement('link')
        newLink.type = ajax ? 'image/gif' : 'image/x-icon'
        newLink.rel = 'shortcut icon'
        newLink.href = favicon
        if (oldLink) {
          document.head.removeChild(oldLink)
        }
        document.head.appendChild(newLink)
      }
      return favicon
    }
  }
}

module.exports = ChangedPageFavicon
