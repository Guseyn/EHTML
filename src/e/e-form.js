
'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode } = require('@page-libs/ajax')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON, StringifiedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const JSResponseByHTTPReponseComponents = require('./../async/JSResponseByHTTPReponseComponents')
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

const VALIDATION_PATTERNS = {
  date: /[0-3]\d\/[0-1]\d\/\d\d\d\d/,
  dateTime: /[0-3]\d\/[0-1]\d\/\d\d\d\d, \d\d:\d\d/,
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  month: /^\d\d\d\d-\d\d$/,
  number: /(\d)+/,
  password: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
  tel: /[0-9]{0,14}$/,
  time: /\d\d:\d\d/,
  // eslint-disable-next-line  no-useless-escape
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
}

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
      this.setAttribute('novalidate', 'true')
      this.validationErrorBoxes = []
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
      this.prepareDifferentFormElements()
    }

    prepareDifferentFormElements () {
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
      if (!target) {
        throw new Error('you must pass target in submit method like: \'this.form.submit(this)\'')
      }
      const uploadProgressBar = new ParsedElmSelectors(
        target.getAttribute('data-upload-progress-bar')
      ).value()[0]
      const progressBar = new ParsedElmSelectors(
        target.getAttribute('data-progress-bar')
      ).value()[0]
      const ajaxIcon = new ParsedElmSelectors(
        target.getAttribute('data-ajax-icon')
      ).value()[0]
      const requestBody = this.requestBody()
      this.hideAllErrorsForForm()
      const validations = []
      this.validateDifferentFormElements(requestBody, validations)
      if (this.isFormValid(validations)) {
        target.setAttribute('disabled', 'true')
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
                target.getAttribute('data-response-name') || 'response',
                new JSResponseByHTTPReponseComponents(
                  new ParsedJSON(
                    new StringFromBuffer(
                      new ResponseBody(
                        as('RESPONSE')
                      )
                    )
                  ),
                  new ResponseHeaders(
                    as('RESPONSE')
                  ),
                  new ResponseStatusCode(
                    as('RESPONSE')
                  )
                ),
                `hideElms('${target.getAttribute('data-ajax-icon')}');`.concat(
                  target.getAttribute('data-actions-on-response') || ''
                )
              )
            )
          )
        ).call()
      } else {
        this.scrollToFirstErrorBox()
      }
    }

    isFormValid (validations) {
      for (let i = 0; i < validations.length; i++) {
        if (!validations[i]) {
          this.showErrorForFormElement(
            this,
            this.getAttribute('data-validation-bad-format-error-message') || `the form is invalid`,
            this.getAttribute('data-validation-error-class-for-element'),
            this.getAttribute('data-validation-error-class-for-message-box')
          )
          return false
        }
      }
      return true
    }

    validateDifferentFormElements (requestBody, validations) {
      this.validateFormElements(this.inputs, requestBody, validations)
      this.validateFormElements(this.selects, requestBody, validations)
      this.validateFormElements(this.textareas, requestBody, validations)
      this.validateFormElements(this.localStorageValues, requestBody, validations)
      this.validateFormElements(this.sessionStorageValues, requestBody, validations)
    }

    validateFormElements (elements, requestBody, results) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        results.push(this.validateFormElement(element, requestBody))
      }
    }

    validateFormElement (element, requestBody) {
      const validationPatternAttribute = element.getAttribute('pattern')
      const requiredAttribute = element.hasAttribute('required')
      const nameAttribute = element.getAttribute('name')
      let value = requestBody[nameAttribute]
      if (typeof value === 'string') {
        value = value.trim()
      }
      if (requiredAttribute) {
        if (!value) {
          this.showErrorForFormElement(
            element,
            element.getAttribute('data-validation-absence-error-message') || `${nameAttribute} is required`,
            element.getAttribute('data-validation-error-class-for-element'),
            element.getAttribute('data-validation-error-class-for-message-box')
          )
          return false
        }
        if (this.isFile(element)) {
          const minFilesNumber = element.getAttribute('data-validation-min-files-number') * 1 || 1
          if (value.length < minFilesNumber) {
            this.showErrorForFormElement(
              element,
              element.getAttribute('data-validation-absence-error-message') || `${nameAttribute} must have at least ${minFilesNumber} files`,
              element.getAttribute('data-validation-error-class-for-element'),
              element.getAttribute('data-validation-error-class-for-message-box')
            )
            return false
          }
        }
        if (this.isCheckbox(element)) {
          const checkboxValue = element.getAttribute('value')
          if (!checkboxValue) {
            throw new Error('checkbox must have \'value\' attribute')
          }
          const checkboxValueIndex = value.findIndex(v => Object.keys(v)[0] === checkboxValue)
          if (!value[checkboxValueIndex][checkboxValue]) {
            this.showErrorForFormElement(
              element,
              element.getAttribute('data-validation-absence-error-message') || `${nameAttribute} is required to be true for this value`,
              element.getAttribute('data-validation-error-class-for-element'),
              element.getAttribute('data-validation-error-class-for-message-box')
            )
            return false
          }
        }
      }
      if (validationPatternAttribute) {
        const validationPattern = VALIDATION_PATTERNS[validationPatternAttribute] || new RegExp(validationPatternAttribute)
        if (!validationPattern.test(value)) {
          this.showErrorForFormElement(
            element,
            element.getAttribute('data-validation-bad-format-error-message') || `${nameAttribute} must have format ${validationPattern}`,
            element.getAttribute('data-validation-error-class-for-element'),
            element.getAttribute('data-validation-error-class-for-message-box')
          )
          return false
        }
      }
      return true
    }

    isCheckbox (element) {
      return element instanceof HTMLInputElement &&
        element.type.toLowerCase() === 'checkbox'
    }

    isFile (element) {
      return element instanceof HTMLInputElement &&
        element.type.toLowerCase() === 'file'
    }

    showErrorForFormElement (element, errorMessage, elementErrorClass, messageBoxErrorClass) {
      const elementWithErrorMessageBox = document.createElement('div')
      const messageBox = document.createElement('div')
      messageBox.innerText = errorMessage
      element.parentNode.replaceChild(elementWithErrorMessageBox, element)
      elementWithErrorMessageBox.appendChild(element)
      elementWithErrorMessageBox.appendChild(messageBox)
      if (elementErrorClass) {
        element.classList.add(elementErrorClass)
      }
      if (messageBoxErrorClass) {
        messageBox.classList.add(messageBoxErrorClass)
      }
      this.validationErrorBoxes.push({
        elementWithErrorMessageBox: elementWithErrorMessageBox,
        element: element
      })
      const listener = () => {
        if (elementWithErrorMessageBox.parentNode) {
          elementWithErrorMessageBox.parentNode.replaceChild(element, elementWithErrorMessageBox)
          if (elementErrorClass) {
            element.classList.remove(elementErrorClass)
          }
        }
        element.removeEventListener('focus', listener)
        element.focus()
      }
      element.addEventListener('focus', listener)
    }

    hideAllErrorsForForm () {
      this.validationErrorBoxes.forEach(errorBox => {
        if (errorBox.elementWithErrorMessageBox.parentNode) {
          errorBox.elementWithErrorMessageBox.parentNode.replaceChild(
            errorBox.element, errorBox.elementWithErrorMessageBox
          )
        }
        const elementErrorClass = errorBox.element.getAttribute('data-validation-error-class-for-element')
        if (elementErrorClass) {
          errorBox.element.classList.remove(elementErrorClass)
        }
      })
      this.validationErrorBoxes = []
    }

    scrollToFirstErrorBox () {
      this.validationErrorBoxes[0].elementWithErrorMessageBox.scrollIntoView()
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
          if (!requestBody[input.name]) {
            requestBody[input.name] = []
          }
          const inputValue = input.value
          if (!inputValue) {
            throw new Error('checkbox must have \'value\' attribute')
          }
          const inputValueObj = {}
          inputValueObj[inputValue] = input.checked
          requestBody[input.name].push(inputValueObj)
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
        this.readFileContentForRequestBody(
          fileInput,
          readProgressBar,
          index,
          filesRead,
          fileInput.files.length
        )
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
