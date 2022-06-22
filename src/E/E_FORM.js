'use strict'

const E = require('./E')
const { as } = require('./../cutie/exports')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode, JSResponseByHTTPReponseComponents } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ShownElement, HiddenElement, EnabledElement, DisabledElement, FirstParsedElmSelector, ButtonWithChangedTextAndAddedClass, ButtonWithChangedToOriginalTextAndRemovedClass } = require('./../async-dom/exports')
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
    form.requestBody = this.requestBody
    form.retrievedValuesFromInputsForRequestBody = this.retrievedValuesFromInputsForRequestBody
    form.retrievedValuesFromSelectsForRequestBody = this.retrievedValuesFromSelectsForRequestBody
    form.retrievedValuesFromTextareasForRequestBody = this.retrievedValuesFromTextareasForRequestBody
    form.retrievedValuesFromLocalStorageForRequestBody = this.retrievedValuesFromLocalStorageForRequestBody
    form.retrievedValuesFromSessionStorageForRequestBody = this.retrievedValuesFromSessionStorageForRequestBody
    form.retrievedDynamicValuesForRequestBody = this.retrievedDynamicValuesForRequestBody
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

  submit (target, isThisTarget = false) {
    if (!target) {
      throw new Error('you must pass target in submit method like: \'this.form.submit(this)\'')
    }
    let requestBody
    let validations = []
    let isFormValid
    if (isThisTarget) {
      requestBody = this.requestBody(target)
      this.hideAllErrorsForForm(target)
      this.validateDifferentFormElements(target, requestBody, validations)
      isFormValid = this.isFormValid(target, validations)
    } else {
      requestBody = this.requestBody(this)
      this.hideAllErrorsForForm(this)
      this.validateDifferentFormElements(this, requestBody, validations)
      isFormValid = this.isFormValid(this, validations)
    }
    if (isFormValid) {
      new DisabledElement(
        target
      ).after(
        new FirstParsedElmSelector(
          target.getAttribute('data-ajax-icon')
        ).as('AJAX_ICON').after(
          new ShownElement(
            as('AJAX_ICON')
          ).after(
            new ButtonWithChangedTextAndAddedClass(
              target,
              target.getAttribute('data-button-ajax-text'),
              target.getAttribute('data-button-ajax-class')
            ).after(
              new ResponseFromAjaxRequest(
                new CreatedOptions(
                  'url', target.getAttribute('data-request-url'),
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
                  )
                ),
                new StringifiedJSON(
                  requestBody
                )
              ).as('RESPONSE').after(
                new EnabledElement(target).after(
                  new HiddenElement(
                    as('AJAX_ICON')
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
                        target.getAttribute('data-actions-on-response')
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ).call()
    } else {
      this.scrollToFirstErrorBox(this)
    }
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

  validateDifferentFormElements (form, requestBody, validations) {
    form.validateFormElements(form, form.inputs, requestBody, validations)
    form.validateFormElements(form, form.selects, requestBody, validations)
    form.validateFormElements(form, form.textareas, requestBody, validations)
    form.validateFormElements(form, form.localStorageValues, requestBody, validations)
    form.validateFormElements(form, form.sessionStorageValues, requestBody, validations)
  }

  validateFormElements (form, elements, requestBody, results) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      results.push(form.validateFormElement(form, element, requestBody))
    }
  }

  validateFormElement (form, element, requestBody) {
    const validationPatternAttribute = element.getAttribute('data-validation-pattern')
    const requiredAttribute = element.hasAttribute('required')
    const nameAttribute = element.getAttribute('name')
    let value = requestBody[nameAttribute]
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

  requestBody (form) {
    const requestBody = {}
    form.retrievedValuesFromInputsForRequestBody(form.inputs, requestBody)
    form.retrievedValuesFromSelectsForRequestBody(form.selects, requestBody)
    form.retrievedValuesFromTextareasForRequestBody(form.textareas, requestBody)
    form.retrievedValuesFromLocalStorageForRequestBody(form.localStorageValues, requestBody)
    form.retrievedValuesFromSessionStorageForRequestBody(form.sessionStorageValues, requestBody)
    form.retrievedDynamicValuesForRequestBody(form.dynamicValues, requestBody)
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
        if (input.checked) {
          requestBody[input.name].push(inputValue)
        }
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

  retrievedDynamicValuesForRequestBody (dynamicValues, requestBody) {
    for (let index = 0; index < dynamicValues.length; index++) {
      const dynamicValue = dynamicValues[index]
      if (!dynamicValue.name) {
        throw new Error(`dynamicValue ${dynamicValue} has no name`)
      }
      requestBody[dynamicValue.name] = dynamicValue.value()
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
