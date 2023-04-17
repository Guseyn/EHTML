'use strict'

const E = require('./E')
const { as } = require('./../cutie/exports')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode, JSResponseByHTTPReponseComponents } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { HiddenElement, EnabledElement, FirstParsedElmSelector, ButtonWithChangedToOriginalTextAndRemovedClass } = require('./../async-dom/exports')
const { ParsedJSON, StringifiedJSON } = require('./../async-json/exports')
const { StringFromBuffer } = require('./../async-string/exports')
const { AppliedActionsOnResponse } = require('./../actions/exports')
const { FileInfo } = require('./../file/exports')
const { ShowProgressEvent, ShowFileReaderProgressEvent, ShowFileReaderEndEvent } = require('./../events/exports')

const VALIDATION_PATTERNS = {
  date: /\d\d\d\d-\d\d-\d\d/,
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

class E_FORM extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.setup()
    if (this.node.hasAttribute('data-request-url')) {
      this.submit(this.node, true)
    }
  }

  setup () {
    this.replaceWithForm()
    this.node.progressBars = this.node.getElementsByTagName('progress')
    this.node.inputs = this.node.getElementsByTagName('input')
    this.node.selects = this.node.getElementsByTagName('select')
    this.node.textareas = this.node.getElementsByTagName('textarea')
    this.node.localStorageValues = this.node.getElementsByTagName('e-local-storage-value')
    this.node.sessionStorageValues = this.node.getElementsByTagName('e-session-storage-value')
    this.node.dynamicValues = this.node.getElementsByTagName('e-form-dynamic-value')
    this.node.buttons = this.node.getElementsByTagName('button')
    this.tuneFileInputs(this.filteredFileInputs(this.node.inputs))
    this.prepareDifferentFormElements()
    this.prepareProgressBars(this.node.progressBars)
  }

  replaceWithForm () {
    const form = document.createElement('form')
    form.setAttribute('novalidate', 'true')
    form.setAttribute('data-e-form', 'true')
    for (let i = 0; i < this.node.attributes.length; i++) {
      form.setAttribute(
        this.node.attributes[i].name,
        this.node.attributes[i].value
      )
    }
    form.onsubmit = () => {
      return false
    }
    form.submit = this.submit
    form.validationErrorBoxes = []
    form.elementsWithValidationError = []
    this.setupMethodsForForm(form)
    while (this.node.firstChild) {
      const child = this.node.removeChild(this.node.firstChild)
      form.appendChild(child)
    }
    this.node.parentNode.replaceChild(form, this.node)
    this.node = form
  }

  setupMethodsForForm (form) {
    form.requestBodyAndQueryObject = this.requestBodyAndQueryObject
    form.urlWithQueryParams = this.urlWithQueryParams
    form.retrievedValuesFromInputsForRequestBodyAndQueryObject = this.retrievedValuesFromInputsForRequestBodyAndQueryObject
    form.retrievedValuesFromSelectsForRequestBodyAndQueryObject = this.retrievedValuesFromSelectsForRequestBodyAndQueryObject
    form.retrievedValuesFromTextareasForRequestBodyAndQueryObject = this.retrievedValuesFromTextareasForRequestBodyAndQueryObject
    form.retrievedValuesFromLocalStorageForRequestBodyAndQueryObject = this.retrievedValuesFromLocalStorageForRequestBodyAndQueryObject
    form.retrievedValuesFromSessionStorageForRequestBodyAndQueryObject = this.retrievedValuesFromSessionStorageForRequestBodyAndQueryObject
    form.retrievedDynamicValuesForRequestBodyAndQueryObject = this.retrievedDynamicValuesForRequestBodyAndQueryObject
    form.hideAllErrorsForForm = this.hideAllErrorsForForm
    form.validateDifferentFormElements = this.validateDifferentFormElements
    form.validateFormElements = this.validateFormElements
    form.validateFormElement = this.validateFormElement
    form.isFormValid = this.isFormValid
    form.isCheckbox = this.isCheckbox
    form.isFile = this.isFile
    form.scrollToFirstErrorBox = this.scrollToFirstErrorBox
    form.showErrorForFormElement = this.showErrorForFormElement
  }

  prepareDifferentFormElements () {
    this.node.allElements = []
    this.prepareFormElements(this.node.inputs)
    this.prepareFormElements(this.node.selects)
    this.prepareFormElements(this.node.textareas)
    this.prepareFormElements(this.node.localStorageValues)
    this.prepareFormElements(this.node.sessionStorageValues)
    this.prepareFormElements(this.node.dynamicValues)
    this.prepareFormElements(this.node.buttons)
  }

  prepareFormElements (elms) {
    for (let index = 0; index < elms.length; index++) {
      const elm = elms[index]
      this.node.allElements.push(elm)
      const ajaxIcon = document.querySelector(
        elm.getAttribute('data-ajax-icon')
      )
      if (ajaxIcon) {
        ajaxIcon.style.display = 'none'
      }
    }
  }

  prepareProgressBars (progressBars) {
    for (let index = 0; index < progressBars.length; index++) {
      if (progressBars[index]) {
        const progressBar = progressBars[index]
        progressBar.max = 100
        progressBar.value = 0
        progressBar.style.display = 'none'
      }
    }
  }

  urlWithQueryParams (url, queryObject) {
    const queryStringBuffer = []
    for (const [ queryName, queryValue ] of Object.entries(queryObject)) {
      const key = encodeURIComponent(queryName)
      const value = encodeURIComponent(queryValue)
      queryStringBuffer.push(`${key}=${value}`)
    }
    if (queryStringBuffer.length > 0) {
      return `${url}?${queryStringBuffer.join('&')}`
    }
    return url
  }

  submit (target, isThisTarget = false) {
    if (!target) {
      throw new Error('you must pass target in submit method like: \'this.form.submit(this)\'')
    }
    let requestBody
    let queryObject
    let validations = []
    let isFormValid
    target.setAttribute('disabled', 'true')
    if (target.hasAttribute('data-ajax-icon')) {
      document.querySelector(target.getAttribute('data-ajax-icon')).style.display = 'block'
    }
    if (target.hasAttribute('data-button-ajax-class')) {
      target.classList.add(target.getAttribute('data-button-ajax-class'))
    }
    if (target.hasAttribute('data-button-ajax-text')) {
      target.originalInnerText = target.innerText
      target.innerText = target.getAttribute('data-button-ajax-text')
    }
    setTimeout(() => {
      if (isThisTarget) {
        const requestBodyAndQueryObject = this.requestBodyAndQueryObject(target)
        requestBody = requestBodyAndQueryObject.requestBody
        queryObject = requestBodyAndQueryObject.queryObject
        this.hideAllErrorsForForm(target)
        this.validateDifferentFormElements(target, requestBody, queryObject, validations)
        isFormValid = this.isFormValid(target, validations)
      } else {
        const requestBodyAndQueryObject = this.requestBodyAndQueryObject(this)
        requestBody = requestBodyAndQueryObject.requestBody
        queryObject = requestBodyAndQueryObject.queryObject
        this.hideAllErrorsForForm(this)
        this.validateDifferentFormElements(this, requestBody, queryObject, validations)
        isFormValid = this.isFormValid(this, validations)
      }
      const downloadResponseBodyAsFileWithName = target.getAttribute('data-download-response-body-as-file-with-name')
      if (isFormValid) {
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', this.urlWithQueryParams(
              target.getAttribute('data-request-url'),
              queryObject
            ),
            'headers', new ParsedJSON(
              target.getAttribute('data-request-headers') || '{}'
            ),
            'method', target.getAttribute('data-request-method') || 'POST',
            'uploadProgressEvent', new ShowProgressEvent(
              new FirstParsedElmSelector(
                target.getAttribute('data-upload-progress-bar')
              )
            ),
            'progressEvent', new ShowProgressEvent(
              new FirstParsedElmSelector(
                target.getAttribute('data-progress-bar')
              )
            ),
            'downloadResponseBodyAsFileWithName', downloadResponseBodyAsFileWithName
          ),
          new StringifiedJSON(
            requestBody
          )
        ).as('RESPONSE').after(
          new EnabledElement(target).after(
            new HiddenElement(
              new FirstParsedElmSelector(
                target.getAttribute('data-ajax-icon')
              )
            ).after(
              new ButtonWithChangedToOriginalTextAndRemovedClass(
                target,
                target.getAttribute('data-button-ajax-class')
              ).after(
                new AppliedActionsOnResponse(
                  target,
                  target.tagName,
                  target.getAttribute('data-response-name'),
                  new JSResponseByHTTPReponseComponents(
                    downloadResponseBodyAsFileWithName
                      ? new ResponseBody(
                        as('RESPONSE')
                      )
                      : new ParsedJSON(
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
                  target.getAttribute('data-actions-on-response')
                )
              )
            )
          )
        ).call()
      } else {
        target.removeAttribute('disabled')
        if (target.hasAttribute('data-ajax-icon')) {
          document.querySelector(target.getAttribute('data-ajax-icon')).style.display = 'none'
        }
        if (target.hasAttribute('data-button-ajax-class')) {
          target.classList.remove(target.getAttribute('data-button-ajax-class'))
        }
        if (target.hasAttribute('data-button-ajax-text')) {
          target.innerText = target.originalInnerText
        }
        this.scrollToFirstErrorBox(this)
      }
    }, 0)
  }

  isFormValid (form, validations) {
    for (let i = 0; i < validations.length; i++) {
      if (!validations[i]) {
        form.showErrorForFormElement(
          form,
          form,
          form.getAttribute('data-validation-error-message'),
          form.getAttribute('data-validation-error-class-for-element'),
          form.getAttribute('data-validation-error-class-for-message-box')
        )
        return false
      }
    }
    return true
  }

  validateDifferentFormElements (form, requestBody, queryObject, validations) {
    form.validateFormElements(form, form.inputs, requestBody, queryObject, validations)
    form.validateFormElements(form, form.selects, requestBody, queryObject, validations)
    form.validateFormElements(form, form.textareas, requestBody, queryObject, validations)
    form.validateFormElements(form, form.localStorageValues, requestBody, queryObject, validations)
    form.validateFormElements(form, form.sessionStorageValues, requestBody, queryObject, validations)
  }

  validateFormElements (form, elements, requestBody, queryObject, results) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      results.push(form.validateFormElement(form, element, requestBody, queryObject))
    }
  }

  validateFormElement (form, element, requestBody, queryObject) {
    const validationPatternAttribute = element.getAttribute('data-validation-pattern')
    const requiredAttribute = element.hasAttribute('required')
    const nameAttribute = element.getAttribute('name')
    let value = (requestBody[nameAttribute] === undefined) ? queryObject[nameAttribute] : requestBody[nameAttribute]
    if (typeof value === 'string') {
      value = value.trim()
    }
    if (requiredAttribute) {
      if (!value) {
        form.showErrorForFormElement(
          form,
          element,
          element.getAttribute('data-validation-absence-error-message'),
          element.getAttribute('data-validation-error-class-for-element'),
          element.getAttribute('data-validation-error-class-for-message-box')
        )
        return false
      }
      if (form.isFile(element)) {
        const minFilesNumber = element.getAttribute('data-validation-min-files-number') * 1 || 1
        if (value.length < minFilesNumber) {
          form.showErrorForFormElement(
            form,
            element,
            element.getAttribute('data-validation-absence-error-message'),
            element.getAttribute('data-validation-error-class-for-element'),
            element.getAttribute('data-validation-error-class-for-message-box')
          )
          return false
        }
      }
      if (form.isCheckbox(element)) {
        const checkboxValue = element.getAttribute('value')
        if (!checkboxValue) {
          throw new Error('checkbox must have \'value\' attribute')
        }
        if (value.indexOf(checkboxValue) === -1) {
          form.showErrorForFormElement(
            form,
            element,
            element.getAttribute('data-validation-absence-error-message'),
            element.getAttribute('data-validation-error-class-for-element'),
            element.getAttribute('data-validation-error-class-for-message-box')
          )
          return false
        }
      }
    }
    if (validationPatternAttribute) {
      const validationPattern = VALIDATION_PATTERNS[validationPatternAttribute] || new RegExp(validationPatternAttribute, 'ig')
      if (!validationPattern.test(value)) {
        form.showErrorForFormElement(
          form,
          element,
          element.getAttribute('data-validation-bad-format-error-message'),
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

  showErrorForFormElement (form, element, errorMessage, elementErrorClass, messageBoxErrorClass) {
    let elementWithErrorMessageBox
    if (errorMessage) {
      elementWithErrorMessageBox = document.createElement('div')
      const messageBox = document.createElement('div')
      messageBox.innerText = errorMessage
      element.parentNode.replaceChild(elementWithErrorMessageBox, element)
      elementWithErrorMessageBox.appendChild(element)
      elementWithErrorMessageBox.appendChild(messageBox)
      form.validationErrorBoxes.push(elementWithErrorMessageBox)
      if (messageBoxErrorClass) {
        messageBox.classList.add(messageBoxErrorClass)
      }
    }
    if (elementErrorClass) {
      element.classList.add(elementErrorClass)
      form.elementsWithValidationError.push(element)
    }
    const listener = () => {
      if (elementWithErrorMessageBox) {
        if (elementWithErrorMessageBox.parentNode) {
          elementWithErrorMessageBox.parentNode.replaceChild(element, elementWithErrorMessageBox)
        }
      }
      if (elementErrorClass) {
        element.classList.remove(elementErrorClass)
      }
      element.removeEventListener('focus', listener)
      element.focus()
      element.click()
    }
    element.addEventListener('focus', listener)
  }

  hideAllErrorsForForm (form) {
    form.validationErrorBoxes.forEach(elementWithErrorMessageBox => {
      if (elementWithErrorMessageBox.parentNode) {
        elementWithErrorMessageBox.parentNode.replaceChild(
          elementWithErrorMessageBox.firstChild, elementWithErrorMessageBox
        )
      }
    })
    form.allElements.forEach(element => {
      const elementErrorClass = element.getAttribute('data-validation-error-class-for-element')
      if (elementErrorClass) {
        element.classList.remove(elementErrorClass)
      }
    })
    form.validationErrorBoxes = []
    form.elementsWithValidationError = []
  }

  scrollToFirstErrorBox (form) {
    if (form.validationErrorBoxes.length > 0) {
      form.validationErrorBoxes[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
    if (form.elementsWithValidationError.length > 0) {
      if (form.validationErrorBoxes.length > 0) {
        if (form.elementsWithValidationError[0].getBoundingClientRect().top < form.validationErrorBoxes[0].getBoundingClientRect().top) {
          form.elementsWithValidationError[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      } else {
        form.elementsWithValidationError[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }

  requestBodyAndQueryObject (form) {
    const requestBody = {}
    const queryObject = {}
    form.retrievedValuesFromInputsForRequestBodyAndQueryObject(form.inputs, requestBody, queryObject)
    form.retrievedValuesFromSelectsForRequestBodyAndQueryObject(form.selects, requestBody, queryObject)
    form.retrievedValuesFromTextareasForRequestBodyAndQueryObject(form.textareas, requestBody, queryObject)
    form.retrievedValuesFromLocalStorageForRequestBodyAndQueryObject(form.localStorageValues, requestBody, queryObject)
    form.retrievedValuesFromSessionStorageForRequestBodyAndQueryObject(form.sessionStorageValues, requestBody, queryObject)
    form.retrievedDynamicValuesForRequestBodyAndQueryObject(form.dynamicValues, requestBody, queryObject)
    return { requestBody, queryObject }
  }

  retrievedValuesFromInputsForRequestBodyAndQueryObject (inputs, requestBody, queryObject) {
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index]
      const valueIsForQueryObject = input.hasAttribute('data-is-query-param')
      const obj = valueIsForQueryObject ? queryObject : requestBody
      if (!input.name) {
        throw new Error(`input ${input} has no name`)
      }
      if (input.type.toLowerCase() === 'radio') {
        if (input.checked) {
          obj[input.name] = input.value
        }
      } else if (input.type.toLowerCase() === 'checkbox') {
        if (!obj[input.name]) {
          obj[input.name] = []
        }
        const inputValue = input.value
        if (!inputValue) {
          throw new Error('checkbox must have \'value\' attribute')
        }
        if (input.checked) {
          obj[input.name].push(inputValue)
        } else if (input.hasAttribute('unchecked-value')) {
          obj[input.name].push(input.getAttribute('unchecked-value'))
        }
      } else if (input.type.toLowerCase() === 'file') {
        obj[input.name] = input.filesInfo
      } else {
        obj[input.name] = input.value
      }
    }
  }

  retrievedValuesFromSelectsForRequestBodyAndQueryObject (selects, requestBody, queryObject) {
    for (let index = 0; index < selects.length; index++) {
      const select = selects[index]
      const valueIsForQueryObject = select.hasAttribute('data-is-query-param')
      const obj = valueIsForQueryObject ? queryObject : requestBody
      if (!select.name) {
        throw new Error(`select ${select} has no name`)
      }
      obj[select.name] = select.value
    }
  }

  retrievedValuesFromTextareasForRequestBodyAndQueryObject (textareas, requestBody, queryObject) {
    for (let index = 0; index < textareas.length; index++) {
      const textarea = textareas[index]
      const valueIsForQueryObject = textarea.hasAttribute('data-is-query-param')
      const obj = valueIsForQueryObject ? queryObject : requestBody
      if (!textarea.name) {
        throw new Error(`textarea ${textarea} has no name`)
      }
      obj[textarea.name] = textarea.value
    }
  }

  retrievedValuesFromLocalStorageForRequestBodyAndQueryObject (localStorageValues, requestBody, queryObject) {
    for (let index = 0; index < localStorageValues.length; index++) {
      const localStorageValue = localStorageValues[index]
      const valueIsForQueryObject = localStorageValue.hasAttribute('data-is-query-param')
      const obj = valueIsForQueryObject ? queryObject : requestBody
      if (!localStorageValue.name) {
        throw new Error(`localStorageValue ${localStorageValue} has no name`)
      }
      obj[localStorageValue.name] = localStorageValue.value()
    }
  }

  retrievedValuesFromSessionStorageForRequestBodyAndQueryObject (sessionStorageValues, requestBody, queryObject) {
    for (let index = 0; index < sessionStorageValues.length; index++) {
      const sessionStorageValue = sessionStorageValues[index]
      const valueIsForQueryObject = sessionStorageValue.hasAttribute('data-is-query-param')
      const obj = valueIsForQueryObject ? queryObject : requestBody
      if (!sessionStorageValue.name) {
        throw new Error(`sessionStorageValue ${sessionStorageValue} has no name`)
      }
      obj[sessionStorageValue.name] = sessionStorageValue.value()
    }
  }

  retrievedDynamicValuesForRequestBodyAndQueryObject (dynamicValues, requestBody, queryObject) {
    for (let index = 0; index < dynamicValues.length; index++) {
      const dynamicValue = dynamicValues[index]
      const valueIsForQueryObject = dynamicValue.hasAttribute('data-is-query-param')
      const obj = valueIsForQueryObject ? queryObject : requestBody
      if (!dynamicValue.name) {
        throw new Error(`dynamicValue ${dynamicValue} has no name`)
      }
      obj[dynamicValue.name] = dynamicValue.value()
    }
  }

  tuneFileInputs (fileInputs) {
    for (let index = 0; index < fileInputs.length; index++) {
      this.tuneFileInput(fileInputs[index])
    }
  }

  tuneFileInput (fileInput) {
    const readProgressBar = document.querySelector(
      fileInput.getAttribute('data-read-progress-bar')
    )
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
}

module.exports = E_FORM
