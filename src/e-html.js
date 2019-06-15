const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')

class EHTML extends HTMLElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return ['data-src']
  }

  render () {
    new ElementWithInnerHTML(
      this.parentElement, new ResponseBody(
        new ResponseFromAjaxRequest({
          url: this.getAttribute('data-src'),
          method: 'GET'
        })
      )
    ).call()
  }

  connectedCallback () {
    this.render()
  }
}

window.customElements.define('e-html', EHTML)
