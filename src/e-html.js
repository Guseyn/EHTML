const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('@page-libs/dom')

class EHTML extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  static get observedAttributes () {
    return ['data-src']
  }

  render () {
    if (!this.rendered) {
      new UnwrappedChildrenOfParent(
        new ElementWithInnerHTML(
          this, new ResponseBody(
            new ResponseFromAjaxRequest({
              url: this.getAttribute('data-src'),
              method: 'GET'
            })
          )
        )
      ).call()
      this.rendered = true
    }
  }

  connectedCallback () {
    this.render()
  }
}

window.customElements.define('e-html', EHTML)
