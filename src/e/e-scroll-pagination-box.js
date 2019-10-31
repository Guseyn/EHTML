'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode } = require('@page-libs/ajax')
const JSResponseByHTTPReponseComponents = require('./../async/JSResponseByHTTPReponseComponents')
const ShownElement = require('./../async/ShownElement')
const HiddenElement = require('./../async/HiddenElement')
const ElementWithMappedObject = require('./../async/ElementWithMappedObject')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')
const PreparedProgressBars = require('./../util/PreparedProgressBars')
const ShowProgressEvent = require('./../util/ShowProgressEvent')
const E = require('./../E')

E(
  'e-scroll-pagination-box',
  class extends HTMLTemplateElement {
    constructor () {
      super()
    }

    onRender () {}

  },
  { extends: 'template' }
)
