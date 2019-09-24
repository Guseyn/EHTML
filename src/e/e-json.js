'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')
const E = require('./../E')

class EJSON extends E {
  constructor () {
    super()
  }

  onRender () {
    const event = this.getAttribute('data-event')
    this.progressBar = new ParsedElmSelectors(
      this.getAttribute('data-progress-bar')
    ).value()[0]
    this.prepareProgressBar(this.progressBar)
    if (event) {
      this.addEventListener(event, this.activate)
    } else {
      this.activate()
    }
  }

  activate () {
    new AppliedActionsOnResponse(
      this.tagName,
      this.getAttribute('data-response-object-name'),
      this.getAttribute('data-actions-on-response'),
      new ParsedJSON(
        new StringFromBuffer(
          new ResponseBody(
            new ResponseFromAjaxRequest(
              new CreatedOptions(
                'url', this.getAttribute('data-src'),
                'method', 'GET',
                'headers', new ParsedJSON(
                  this.getAttribute('data-headers') || '{}'
                ),
                'progressEvent', this.showProgress(this.progressBar)
              )
            )
          )
        )
      )
    ).call()
  }

  prepareProgressBar (progressBar) {
    if (progressBar) {
      progressBar.max = 100
      progressBar.value = 0
      progressBar.style.display = 'none'
    }
  }

  showProgress (progressBar) {
    if (progressBar) {
      return (event) => {
        if (event.lengthComputable) {
          progressBar.style.display = ''
          const percentComplete = parseInt((event.loaded / event.total) * 100)
          progressBar.value = percentComplete
          if (progressBar.value === 100) {
            progressBar.style.display = 'none'
          }
        }
      }
    }
    return () => {}
  }
}

window.customElements.define('e-json', EJSON)

module.exports = EJSON
