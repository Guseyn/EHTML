'use strict'

const E = require('./E')
const { TurboRedirected } = require('./../async-location/exports')
const { ParsedJSON } = require('./../async-json/exports')

class E_TURBOLINK extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.replaceWithLink()
    this.node.addEventListener('click', () => {
      new TurboRedirected(
        this.node.getAttribute('data-href'),
        new ParsedJSON(
          this.node.getAttribute('data-headers') || '{}'
        ),
        {
          ajaxFavicon: this.node.getAttribute('data-ajax-favicon'),
          progressBarClassName: this.node.getAttribute('data-with-progress-bar'),
          progressBarPlace: this.node.getAttribute('data-progress-bar-place')
        }
      ).call()
    })
  }

  replaceWithLink () {
    const link = document.createElement('a')
    link.setAttribute('data-e-turbolink', 'true')
    for (let i = 0; i < this.node.attributes.length; i++) {
      link.setAttribute(
        this.node.attributes[i].name,
        this.node.attributes[i].value
      )
    }
    while (this.node.firstChild) {
      const child = this.node.removeChild(this.node.firstChild)
      link.appendChild(child)
    }
    this.node.parentNode.replaceChild(link, this.node)
    this.node = link
  }
}

module.exports = E_TURBOLINK
