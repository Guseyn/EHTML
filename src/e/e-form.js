
'use strict'

const { browserified } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON, StringifiedJSON } = browserified(require('@cuties/json'))
const AppliedActions = require('./../async/AppliedActions')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')
const FileInfo = require('./../util/FileInfo')
const E = require('./../E')

class EForm extends E {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'data-request-url',
      'data-request-method',
      'data-request-headers',
      'data-request-button-id',
      'data-upload-progress-bar-id',
      'data-actions'
    ]
  }

  supportedActions () {
    return [
      'redirect',
      'saveToLocalStorage',
      'saveToMemoryStorage',
      'innerHTML',
      'addHTMLTo',
      'mapObjToElm',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  onRender () {
    const requestButton = new ParsedElmSelectors(
      this.attr('data-request-button-id')
    ).value()[0]
    const uploadProgressBar = new ParsedElmSelectors(
      this.attr('data-upload-progress-bar-id')
    ).value()[0]
    const progressBar = new ParsedElmSelectors(
      this.attr('data-progress-bar-id')
    ).value()[0]
    if (requestButton) {
      this.tuneFileInputs(
        this.filteredFileInputs(
          this.getElementsByTagName('input')
        ), requestButton
      )
      requestButton.addEventListener('click', () => {
        const requestBody = this.requestBody()
        new AppliedActions(
          this.tagName,
          this.attr('data-object'),
          this.attr('data-actions'),
          this.supportedActions(),
          new ParsedJSON(
            new ResponseBody(
              new ResponseFromAjaxRequest(
                new CreatedOptions(
                  'url', this.attr('data-request-url'),
                  'headers', new ParsedJSON(
                    this.attr('data-request-headers') || '{}'
                  ),
                  'method', this.attr('data-request-method') || 'POST',
                  'uploadProgressEvent', uploadProgressBar ? uploadProgressBar.showProgress : () => {},
                  'progressEvent', progressBar ? progressBar.showProgress : () => {}
                ),
                new StringifiedJSON(
                  requestBody
                )
              )
            )
          )
        ).call()
      })
    }
  }

  requestBody () {
    const inputs = this.getElementsByTagName('input')
    const selects = this.getElementsByTagName('select')
    const textareas = this.getElementsByTagName('textarea')
    const localStorageValues = this.getElementsByTagName('e-local-storage-value')
    const memoryStorageValues = this.getElementsByTagName('e-memory-storage-value')
    const requestBody = {}
    this.retrievedValuesFromInputsForRequestBody(inputs, requestBody)
    this.retrievedValuesFromSelectsForRequestBody(selects, requestBody)
    this.retrievedValuesFromTextareasForRequestBody(textareas, requestBody)
    this.retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody)
    this.retrievedValuesFromMemoryStorageForRequestBody(memoryStorageValues, requestBody)
    return requestBody
  }

  retrievedValuesFromInputsForRequestBody (inputs, requestBody) {
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index]
      if (!input.name) {
        throw new Error(`input ${input} has no name`)
      }
      if (input.type.toLowerCase() === 'radio') {
        if (input.checked) {
          requestBody[input.name] = input.value
        }
      } else if (input.type.toLowerCase() === 'checkbox') {
        requestBody[input.name] = input.checked
      } else if (input.type.toLowerCase() === 'file') {
        requestBody[input.name] = input.filesInfo
      } else {
        requestBody[input.name] = input.value
      }
    }
  }

  retrievedValuesFromSelectsForRequestBody (selects, requestBody) {
    for (let index = 0; index < selects.length; index++) {
      const select = selects[index]
      if (!select.name) {
        throw new Error(`select ${select} has no name`)
      }
      requestBody[select.name] = select.value
    }
  }

  retrievedValuesFromTextareasForRequestBody (textareas, requestBody) {
    for (let index = 0; index < textareas.length; index++) {
      const textarea = textareas[index]
      if (!textarea.name) {
        throw new Error(`textarea ${textarea} has no name`)
      }
      requestBody[textarea.name] = textarea.value
    }
  }

  retrievedValuesFromLocalStorageForRequestBody (localStorageValues, requestBody) {
    for (let index = 0; index < localStorageValues.length; index++) {
      const localStorageValue = localStorageValues[index]
      if (!localStorageValue.name) {
        throw new Error(`localStorageValue ${localStorageValue} has no name`)
      }
      requestBody[localStorageValue.name] = localStorageValue.value()
    }
  }

  retrievedValuesFromMemoryStorageForRequestBody (memoryStorageValues, requestBody) {
    for (let index = 0; index < memoryStorageValues.length; index++) {
      const memoryStorageValue = memoryStorageValues[index]
      if (!memoryStorageValue.name) {
        throw new Error(`memoryStorageValue ${memoryStorageValue} has no name`)
      }
      requestBody[memoryStorageValue.name] = memoryStorageValue.value()
    }
  }

  tuneFileInputs (fileInputs, requestButton) {
    for (let index = 0; index < fileInputs.length; index++) {
      this.tuneFileInput(fileInputs[index], requestButton)
    }
  }

  tuneFileInput (fileInput, requestButton) {
    fileInput.addEventListener('change', () => {
      this.readFilesContentForRequestBody(fileInput, requestButton)
    })
  }

  readFilesContentForRequestBody (fileInput, requestButton) {
    fileInput.filesInfo = []
    for (let index = 0; index < fileInput.files.length; index++) {
      this.readFileContentForRequestBody(fileInput, requestButton, index)
    }
  }

  readFileContentForRequestBody (fileInput, requestButton, index) {
    const file = fileInput.files[index]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadstart = () => {
      requestButton.setAttribute('disabled', true)
    }
    reader.onload = () => {
      fileInput.filesInfo[index] = new FileInfo(
        file.name,
        file.size,
        file.type,
        reader.result,
        file.lastModifiedDate
      )
      requestButton.removeAttribute('disabled')
    }
    reader.onabort = () => {
      requestButton.removeAttribute('disabled')
    }
    reader.onprogress = () => {
      // TODO
    }
    reader.onerror = function () {
      throw new Error(`cound not read file ${file.name}`)
    }
  }

  filteredFileInputs (inputs) {
    const fileInputs = {
      length: 0
    }
    for (let index = 0; index < inputs.length; index++) {
      if (inputs[index].type.toLowerCase() === 'file') {
        fileInputs[fileInputs.length] = inputs[index]
        fileInputs.length += 1
      }
    }
    return fileInputs
  }
}

window.customElements.define('e-form', EForm)

module.exports = EForm
