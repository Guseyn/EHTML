'use strict'

const E = require('./E')
const { as } = require('./../cutie/exports')
const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ParsedJSON, Value } = require('./../async-json/exports')
const { StringFromBuffer } = require('./../async-string/exports')
const { ActivatedTemplate } = require('./../async-dom/exports')
const { LocalStorageWithSetValue } = require('./../async-storage/exports')

class E_CACHE_VERSION extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    const versionSrc = this.node.getAttribute('data-src')
    const versionUpdateEveryNHours = this.node.getAttribute('data-update-every-n-hours')
    const lastVersionUpdateDate = window.localStorage.getItem('last-version-update-date')
    if (!versionSrc) {
      throw new Error(`e-cache-version must have "data-src" attribute`)
    }
    if (!versionUpdateEveryNHours) {
      throw new Error(`e-cache-version must have "data-update-every-n-hours" attribute`)
    }
    if (
      (lastVersionUpdateDate === undefined) ||
      (((new Date().getTime() - lastVersionUpdateDate * 1) / (1000 * 60 * 60)) >= versionUpdateEveryNHours * 1)
    ) {
      new ResponseFromAjaxRequest(
        new CreatedOptions(
          'url', this.node.getAttribute('data-src'),
          'method', 'GET'
        )
      ).as('RESPONSE').after(
        new Value(
          new ParsedJSON(
            new StringFromBuffer(
              new ResponseBody(
                as('RESPONSE')
              )
            )
          ),
          'version'
        ).as('VERSION').after(
          new LocalStorageWithSetValue(
            window.localStorage,
            'version',
            as('VERSION')
          ).after(
            new LocalStorageWithSetValue(
              window.localStorage,
              'last-version-update-date',
              new Date().getTime()
            ).after(
              new ActivatedTemplate(
                this.node
              )
            )
          )
        )
      ).call()
    } else {
      new ActivatedTemplate(
        this.node
      ).call()
    }
  }
}

module.exports = E_CACHE_VERSION
