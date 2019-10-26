
'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode } = require('@page-libs/ajax')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON, StringifiedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse')
const ShownElement = require('./../async/ShownElement')
const EnabledElement = require('./../async/EnabledElement')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')
const FileInfo = require('./../util/FileInfo')
const ShowProgressEvent = require('./../util/ShowProgressEvent')
const ShowFileReaderProgressEvent = require('./../util/ShowFileReaderProgressEvent')
const ShowFileReaderEndEvent = require('./../util/ShowFileReaderEndEvent')
const PreparedProgressBars = require('./../util/PreparedProgressBars')
const E = require('./../E')

E(
  'e-form',
  class extends HTMLFormElement {
    constructor () {
      super()
    }

    static get observedAttributes () {
      return [ ]
    }

    onRender () {
      this.onsubmit = () => {
        return false
      }
      this.progressBars = new PreparedProgressBars(
        this.getElementsByTagName('progress')
      ).value()
      this.inputs = this.getElementsByTagName('input')
      this.selects = this.getElementsByTagName('select')
      this.textareas = this.getElementsByTagName('textarea')
      this.localStorageValues = this.getElementsByTagName('e-local-storage-value')
      this.sessionStorageValues = this.getElementsByTagName('e-session-storage-value')
      this.buttons = this.getElementsByTagName('button')
      this.tuneFileInputs(this.filteredFileInputs(this.inputs))
      this.prepareFormElements(this.inputs)
      this.prepareFormElements(this.selects)
      this.prepareFormElements(this.textareas)
      this.prepareFormElements(this.localStorageValues)
      this.prepareFormElements(this.sessionStorageValues)
      this.prepareFormElements(this.buttons)
    }

    prepareFormElements (elms) {
      for (let index = 0; index < elms.length; index++) {
        const elm = elms[index]
        const ajaxIcon = new ParsedElmSelectors(
          elm.getAttribute('data-ajax-icon')
        ).value()[0]
        if (ajaxIcon) {
          ajaxIcon.style.display = 'none'
        }
      }
    }

    submit (target) {
      const uploadProgressBar = new ParsedElmSelectors(
        target.getAttribute('data-upload-progress-bar')
      ).value()[0]
      const progressBar = new ParsedElmSelectors(
        target.getAttribute('data-progress-bar')
      ).value()[0]
      const ajaxIcon = new ParsedElmSelectors(
        target.getAttribute('data-ajax-icon')
      ).value()[0]
      target.setAttribute('disabled', 'true')
      const requestBody = this.requestBody()
      new ShownElement(
        ajaxIcon
      ).after(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', target.getAttribute('data-request-url'),
            'headers', new ParsedJSON(
              target.getAttribute('data-request-headers') || '{}'
            ),
            'method', target.getAttribute('data-request-method') || 'POST',
            'uploadProgressEvent', new ShowProgressEvent(uploadProgressBar),
            'progressEvent', new ShowProgressEvent(progressBar)
          ),
          new StringifiedJSON(
            requestBody
          )
        ).as('RESPONSE').after(
          new EnabledElement(target).after(
            new AppliedActionsOnResponse(
              target.tagName,
              target.getAttribute('data-response-object-name') || 'responseObject',
              new ParsedJSON(
                new StringFromBuffer(
                  new ResponseBody(
                    as('RESPONSE')
                  )
                )
              ),
              target.getAttribute('data-response-headers-name') || 'responseHeaders',
              new ResponseHeaders(
                as('RESPONSE')
              ),
              target.getAttribute('data-response-status-code-name') || 'responseStatusCode',
              new ResponseStatusCode(
                as('RESPONSE')
              ),
              `hideElms('${target.getAttribute('data-ajax-icon')}');`.concat(
                target.getAttribute('data-actions-on-response') || ''
              )
            )
          )
        )
      ).call()
    }

    requestBody () {
      const requestBody = {}
      this.retrievedValuesFromInputsForRequestBody(this.inputs, requestBody)
      this.retrievedValuesFromSelectsForRequestBody(this.selects, requestBody)
      this.retrievedValuesFromTextareasForRequestBody(this.textareas, requestBody)
      this.retrievedValuesFromLocalStorageForRequestBody(this.localStorageValues, requestBody)
      this.retrievedValuesFromSessionStorageForRequestBody(this.sessionStorageValues, requestBody)
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

    retrievedValuesFromSessionStorageForRequestBody (sessionStorageValues, requestBody) {
      for (let index = 0; index < sessionStorageValues.length; index++) {
        const sessionStorageValue = sessionStorageValues[index]
        if (!sessionStorageValue.name) {
          throw new Error(`sessionStorageValue ${sessionStorageValue} has no name`)
        }
        requestBody[sessionStorageValue.name] = sessionStorageValue.value()
      }
    }

    tuneFileInputs (fileInputs) {
      for (let index = 0; index < fileInputs.length; index++) {
        this.tuneFileInput(fileInputs[index])
      }
    }

    tuneFileInput (fileInput) {
      const readProgressBar = new ParsedElmSelectors(
        fileInput.getAttribute('data-read-progress-bar')
      ).value()[0]
      fileInput.addEventListener('change', () => {
        this.readFilesContentForRequestBody(fileInput, readProgressBar)
      })
    }

    readFilesContentForRequestBody (fileInput, readProgressBar) {
      fileInput.filesInfo = []
      const filesRead = { count: 0 }
      for (let index = 0; index < fileInput.files.length; index++) {
        this.readFileContentForRequestBody(fileInput, readProgressBar, index, filesRead, fileInput.files.length)
      }
    }

    readFileContentForRequestBody (fileInput, readProgressBar, index, filesRead, filesLength) {
      const file = fileInput.files[index]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        fileInput.filesInfo[index] = new FileInfo(
          file.name,
          file.size,
          file.type,
          reader.result,
          file.lastModifiedDate
        )
      }
      reader.onprogress = new ShowFileReaderProgressEvent(readProgressBar)
      reader.onloadend = new ShowFileReaderEndEvent(readProgressBar, filesRead, filesLength)
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
  },
  { extends: 'form' }
)
