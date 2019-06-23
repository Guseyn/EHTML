const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions, TheSameObjectWithValue } = browserified(
  require('@cuties/object')
)
const { ParsedJSON } = browserified(
  require('@cuties/json')
)
const { StringFromBuffer } = browserified(
  require('@cuties/buffer')
)
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { UnwrappedChildrenOfParent } = require('@page-libs/dom')
const AttributeWithAppliedLocalStorageVariables = require('./async/AttributeWithAppliedLocalStorageVariables')
const ElementWithAppliedValuesInTextNodes = require('./async/ElementWithAppliedValuesInTextNodes')

class EJSON extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
    this.cache = {}
  }

  static get observedAttributes () {
    return ['data-src', 'data-method', 'data-headers', 'data-request-body', 'data-object']
  }

  render () {
    if (!this.rendered) {
      new ParsedJSON(
        new StringFromBuffer(
          new ResponseBody(
            new ResponseFromAjaxRequest(
              new CreatedOptions(
                'url', new AttributeWithAppliedLocalStorageVariables(
                  this.getAttribute('data-src')
                ),
                'method', this.getAttribute('data-method') || 'GET',
                'headers', new ParsedJSON(
                  new AttributeWithAppliedLocalStorageVariables(
                    this.getAttribute('data-headers') || '{}'
                  )
                )
              ),
              new AttributeWithAppliedLocalStorageVariables(
                this.getAttribute('data-request-body')
              )
            )
          )
        )
      ).as('response').after(
        new TheSameObjectWithValue(
          this.cache,
          this.getAttribute('data-object'),
          as('response')
        ).after(
          new UnwrappedChildrenOfParent(
            new ElementWithAppliedValuesInTextNodes(
              this, this.cache
            )
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

window.customElements.define('e-json', EJSON)
