import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import evaluateActionsOnResponse from '#ehtml/evaluateActionsOnResponse.js'

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

export default class EForm extends HTMLFormElement {
  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener('ehtml:activated', this.onEHTMLActivated, { once: true })
  }

  onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    this.run()
  }

  run() {
    initializeForm(this)
  }
}

customElements.define('e-form', EForm, { extends: 'form' })

function initializeForm(form) {
  form.setAttribute('novalidate', 'true')
  form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault()
      event.stopPropagation()

      const closestForm = event.target.closest('form')
      if (form !== closestForm) {
        return false
      }

      const firstElmWithRequestUrl =
        closestForm.querySelector('[data-request-url]')

      if (!firstElmWithRequestUrl) {
        return false
      }
      if (firstElmWithRequestUrl.closest('form') !== form) {
        return false
      }
      if (form.hasAttribute('data-do-not-trigger-on-enter')) {
        return false
      }

      submit(firstElmWithRequestUrl)
    }
  })
  form.onsubmit = () => {
    return false
  }

  form.validationErrorBoxes = []
  form.elementsWithValidationError = []
  form.setupForm = setupForm
  form.updateForm = setupForm
  form.submit = submit
  form.ehtmlSubmit = submit

  setupForm(form)

  let setupPending = false

  // Tags that matter for form structure
  const RELEVANT_TAGS = new Set([
    'INPUT',
    'SELECT',
    'TEXTAREA',
    'BUTTON',

    // EHTML form-related custom elements
    'E-LOCAL-STORAGE-VALUE',
    'E-SESSION-STORAGE-VALUE',
    'E-FORM-DYNAMIC-VALUE',
    'E-FORM-ARRAY',
    'E-FORM-OBJECT'
  ])

  function nodeIsRelevant(node) {
    if (!(node instanceof Element)) {
      return false
    }
    if (RELEVANT_TAGS.has(node.tagName)) {
      return true
    }
    for (const child of node.querySelectorAll('*')) {
      if (RELEVANT_TAGS.has(child.tagName)) {
        return true
      }
    }
    return false
  }

  queueMicrotask(() => {
    if (form.hasAttribute('data-request-url') || form.hasAttribute('data-socket')) {
      submit(form, true)
    }
  })

  const observer = new MutationObserver((mutationList) => {
    let shouldRunSetup = false

    for (const mut of mutationList) {
      for (const node of mut.addedNodes) {
        if (!form.contains(node)) continue
        if (nodeIsRelevant(node)) {
          shouldRunSetup = true
          break
        }
      }
      for (const node of mut.removedNodes) {
        if (nodeIsRelevant(node)) {
          shouldRunSetup = true
          break
        }
      }
      if (shouldRunSetup) {
        break
      }
    }

    if (shouldRunSetup && !setupPending) {
      setupPending = true
      queueMicrotask(() => {
        setupPending = false
        setupForm(form)
      })
    }
  })

  observer.observe(form, {
    childList: true,
    subtree: true
  })

  // store observer on form so cleanup is possible later
  form.ehtmlFormMutationObserver = observer

  return form
}

function setupForm (form) {
  form.progressBars = filterApplicableFormElements(form, [...form.getElementsByTagName('progress')])
  form.inputs = filterApplicableFormElements(form, [...form.getElementsByTagName('input')])
  form.selects = filterApplicableFormElements(form, [...form.getElementsByTagName('select')])
  form.textareas = filterApplicableFormElements(form, [...form.getElementsByTagName('textarea')])
  form.localStorageValues = filterApplicableFormElements(form, [...form.getElementsByTagName('e-local-storage-value')])
  form.sessionStorageValues = filterApplicableFormElements(form, [...form.getElementsByTagName('e-session-storage-value')])
  form.dynamicValues = filterApplicableFormElements(form, [...form.getElementsByTagName('e-form-dynamic-value')])
  form.buttons = filterApplicableFormElements(form, [...form.getElementsByTagName('button')])
  tuneFileInputs(filteredFileInputs(form.inputs))
  prepareDifferentFormElements(form)
  disableDefaultSubmitForButtons(form.buttons)
  prepareProgressBars(form.progressBars)
}

function filterApplicableFormElements (form, elms) {
  return elms.filter(e => !e.hasAttribute('data-ignore')).filter(e => e.closest('form') == form)
}

function tuneFileInputs (fileInputs) {
  for (let index = 0; index < fileInputs.length; index++) {
    tuneFileInput(fileInputs[index])
  }
}

function tuneFileInput (fileInput) {
  if (fileInput.isTunedByEHTML) {
    return
  }
  const readProgressBar = document.querySelector(
    fileInput.getAttribute('data-read-progress-bar')
  )
  fileInput.addEventListener('change', () => {
    readFilesContentForRequestBody(fileInput, readProgressBar)
  })
  fileInput.isTunedByEHTML = true
}

function readFilesContentForRequestBody (fileInput, readProgressBar) {
  fileInput.filesInfo = []
  const filesRead = { count: 0 }
  for (let index = 0; index < fileInput.files.length; index++) {
    readFileContentForRequestBody(
      fileInput,
      readProgressBar,
      index,
      filesRead,
      fileInput.files.length
    )
  }
}

function readFileContentForRequestBody (fileInput, readProgressBar, index, filesRead, filesLength) {
  const file = fileInput.files[index]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    fileInput.filesInfo[index] = {
      name: file.name,
      size: file.size,
      type: file.type,
      content: reader.result,
      lastModifiedDate: file.lastModifiedDate
    }
  }
  reader.onprogress = (event) => {
    if (event.lengthComputable && readProgressBar) {
      readProgressBar.style.display = ''
      const percentComplete = parseInt((event.loaded / event.total) * 100)
      readProgressBar.value = percentComplete
    }
  }
  reader.onloadend = () => {
    filesRead.count += 1
    if (readProgressBar) {
      if (filesRead.count === filesLength) {
        readProgressBar.style.display = 'none'
      } else {
        readProgressBar.value = 0
      }
    }
  }
  reader.onerror = function () {
    throw new Error(`cound not read file ${file.name}`)
  }
}

function filteredFileInputs (inputs) {
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

function prepareDifferentFormElements (form) {
  form.allElements = []
  prepareFormElements(form, form.inputs)
  prepareFormElements(form, form.selects)
  prepareFormElements(form, form.textareas)
  prepareFormElements(form, form.localStorageValues)
  prepareFormElements(form, form.sessionStorageValues)
  prepareFormElements(form, form.dynamicValues)
  prepareFormElements(form, form.buttons)
}

function prepareFormElements (form, elms) {
  for (let index = 0; index < elms.length; index++) {
    const elm = elms[index]
    if (elm.isPreparedByEHTML) {
      continue
    }
    form.allElements.push(elm)
    const ajaxIcon = document.querySelector(
      elm.getAttribute('data-ajax-icon')
    )
    if (ajaxIcon) {
      ajaxIcon.style.display = 'none'
    }
    elm.isPreparedByEHTML = true
  }
}

function disableDefaultSubmitForButtons (buttons) {
  for (let index = 0; index < buttons.length; index++) {
    const button = buttons[index]
    button.setAttribute('type', 'button')
  }
}

function prepareProgressBars (progressBars) {
  for (let index = 0; index < progressBars.length; index++) {
    if (progressBars[index]) {
      const progressBar = progressBars[index]
      if (progressBar.isPreparedByEHTML) {
        continue
      }
      progressBar.max = 100
      progressBar.value = 0
      progressBar.style.display = 'none'
      progressBar.isPreparedByEHTML = true
    }
  }
}

function urlWithQueryParams (url, queryObject) {
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

function submit (target, targetIsForm) {

  const form = targetIsForm ? target : target.form
  if (!form) {
    throw new Error('you must pass form in submit method like: \'this.submit(this)\'')
  }
  if (target.closest('form') !== form) {
    return false
  }

  form.progressBars = form.progressBars.filter(e => form.contains(e) && e.closest('form') === form)
  form.inputs = form.inputs.filter(e => form.contains(e) && e.closest('form') === form)
  form.selects = form.selects.filter(e => form.contains(e) && e.closest('form') === form)
  form.textareas = form.textareas.filter(e => form.contains(e) && e.closest('form') === form)
  form.localStorageValues = form.localStorageValues.filter(e => form.contains(e) && e.closest('form') === form)
  form.sessionStorageValues = form.sessionStorageValues.filter(e => form.contains(e) && e.closest('form') === form)
  form.dynamicValues = form.dynamicValues.filter(e => form.contains(e) && e.closest('form') === form)
  form.buttons = form.buttons.filter(e => form.contains(e) && e.closest('form') === form)

  const validations = []

  const socketName = target.getAttribute('data-socket')

  if (!targetIsForm && !socketName) {
    target.setAttribute('disabled', 'true')
  }

  const ajaxIcon = document.querySelector(
    target.getAttribute('data-ajax-icon')
  )

  if (ajaxIcon && !socketName) {
    ajaxIcon.style.display = 'block'
  }
  if (target.hasAttribute('data-button-ajax-class') && !targetIsForm && !socketName) {
    target.classList.add(target.getAttribute('data-button-ajax-class'))
  }
  if (target.hasAttribute('data-button-ajax-text') && !targetIsForm && !socketName && target.nodeName.toLowerCase() === 'button') {
    target.originalInnerText = target.innerText
    target.innerText = target.getAttribute('data-button-ajax-text')
  }

  const { requestBody, queryObject } = requestBodyAndQueryObject(form)
  hideAllErrorsForForm(form)
  validateDifferentFormElements(form, requestBody, queryObject, validations)

  form.isValid = false

  const state = getNodeScopedState(target)

  if (isFormValid(form, validations)) {
    form.isValid = true
    if (socketName) {
      if (!window.__EHTML_WEB_SOCKETS__ || !window.__EHTML_WEB_SOCKETS__[socketName]) {
        throw new Error(`socket with name "${socketName}" is not defined or not open yet`)
      }
      const socket = window.__EHTML_WEB_SOCKETS__[socketName]
      if (socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify(requestBody)
        socket.send(message)
      } else {
        throw new Error(`socket with name "${socketName}" is not open`)
      }
      return
    }

    if (!target.hasAttribute('data-request-url')) {
      throw new Error('e-form must have "data-request-url" attribute in the element that submits it')
    }

    if (target.getAttribute('data-request-url') === 'echo/request/body') {
      if (!targetIsForm) {
        target.removeAttribute('disabled')
      }
      if (ajaxIcon) {
        ajaxIcon.style.display = 'none'
      }
      if (target.hasAttribute('data-button-ajax-class') && !targetIsForm) {
        target.classList.remove(target.getAttribute('data-button-ajax-class'))
      }
      if (target.originalInnerText) {
        target.innerText = target.originalInnerText
      }
      evaluateActionsOnResponse(
        target.getAttribute('data-actions-on-response'),
        target.getAttribute('data-response-name'),
        {
          body: requestBody,
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
            ':status': 200
          }
        },
        target,
        state
      )
      return
    }

    const downloadResponseBodyAsFileWithName = target.getAttribute('data-download-response-body-as-file-with-name')

    const uploadProgressBarSelector = target.getAttribute('data-upload-progress-bar')
    const uploadProgressBar = document.querySelector(uploadProgressBarSelector)

    const progressBarSelector = target.getAttribute('data-progress-bar')
    const progressBar = document.querySelector(progressBarSelector)

    if (target.hasAttribute('data-actions-on-progress')) {
      evaluateActionsOnProgress(
        target.getAttribute('data-actions-on-progress'),
        target,
        state
      )
    }

    responseFromAjaxRequest({
      url: urlWithQueryParams(
        evaluatedStringWithParamsFromState(
          target.getAttribute('data-request-url'),
          state,
          target
        ),
        queryObject
      ),
      headers: evaluatedValueWithParamsFromState(
        target.getAttribute('data-request-headers') || '${{}}',
        state,
        target
      ),
      method: target.getAttribute('data-request-method') || 'POST',
      uploadProgressEvent: (event) => {
        if (uploadProgressBar) {
          if (event.lengthComputable) {
            uploadProgressBar.style.display = ''
            const percentComplete = parseInt((event.loaded / event.total) * 100)
            uploadProgressBar.value = percentComplete
            if (uploadProgressBar.value === 100) {
              uploadProgressBar.style.display = 'none'
            }
          }
        }
      },
      progressEvent: (event) => {
        if (progressBar) {
          if (event.lengthComputable) {
            progressBar.style.display = ''
            const percentComplete = parseInt((event.loaded / event.total) * 100)
            progressBar.value = percentComplete
            if (progressBar.value === 100) {
              progressBar.style.display = 'none'
            }
          }
        }
      },
      downloadResponseBodyAsFileWithName
    }, JSON.stringify(requestBody), (err, resObj) => {
      if (err) {
        throw err
      }
      if (!targetIsForm) {
        target.removeAttribute('disabled')
      }
      if (ajaxIcon) {
        ajaxIcon.style.display = 'none'
      }
      if (target.hasAttribute('data-button-ajax-class') && !targetIsForm) {
        target.classList.remove(target.getAttribute('data-button-ajax-class'))
      }
      if (target.originalInnerText) {
        target.innerText = target.originalInnerText
      }

      const responseBodyAsBuffer = resObj.body
      const responseBodyAsObject = JSON.parse(
        responseBodyAsBuffer.toString('utf-8', 0, responseBodyAsBuffer.length)
      )
      evaluateActionsOnResponse(
        target.getAttribute('data-actions-on-response'),
        target.getAttribute('data-response-name'),
        {
          body: responseBodyAsObject,
          statusCode: resObj.statusCode,
          headers: resObj.headers
        },
        target,
        state
      )
    })
  } else {
    if (!targetIsForm) {
      target.removeAttribute('disabled')
    }
    if (ajaxIcon) {
      ajaxIcon.style.display = 'none'
    }
    if (target.hasAttribute('data-button-ajax-class') && !targetIsForm) {
      target.classList.remove(target.getAttribute('data-button-ajax-class'))
    }
    if (target.originalInnerText && !targetIsForm) {
      target.innerText = target.originalInnerText
    }
    scrollToFirstErrorBox(form)
  }
}

function validateDifferentFormElements (form, requestBody, queryObject, validations) {
  validateFormElements(form, form.inputs, requestBody, queryObject, validations)
  validateFormElements(form, form.selects, requestBody, queryObject, validations)
  validateFormElements(form, form.textareas, requestBody, queryObject, validations)
  validateFormElements(form, form.localStorageValues, requestBody, queryObject, validations)
  validateFormElements(form, form.sessionStorageValues, requestBody, queryObject, validations)
}

function isFormValid (form, validations) {
  for (let i = 0; i < validations.length; i++) {
    if (!validations[i]) {
      showErrorForFormElement(
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

function validateFormElements (form, elements, requestBody, queryObject, validations) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    validations.push(
      validateFormElement(form, element, requestBody, queryObject)
    )
  }
}

function validateFormElement (form, element, requestBody, queryObject) {
  const validationPatternAttribute = element.getAttribute('data-validation-pattern')
  const requiredAttribute = element.hasAttribute('required')
  const valueIsForQueryObject = element.getAttribute('data-is-query-param')
  const properyPath = []
  buildFullPathOfProperyForRequestBodyByFormElementPosition(
    element, properyPath, valueIsForQueryObject
  )
  const obj = valueIsForQueryObject ? queryObject : requestBody
  let value = returnValueByPropertyPath(obj, properyPath)
  if (typeof value === 'string') {
    value = value.trim()
  }
  if (requiredAttribute) {
    if (!value) {
      showErrorForFormElement(
        form,
        element,
        element.getAttribute('data-validation-absence-error-message'),
        element.getAttribute('data-validation-error-class-for-element'),
        element.getAttribute('data-validation-error-class-for-message-box')
      )
      return false
    }
    if (isFile(element)) {
      const minFilesNumber = element.getAttribute('data-validation-min-files-number') * 1 || 1
      if (value.length < minFilesNumber) {
        showErrorForFormElement(
          form,
          element,
          element.getAttribute('data-validation-absence-error-message'),
          element.getAttribute('data-validation-error-class-for-element'),
          element.getAttribute('data-validation-error-class-for-message-box')
        )
        return false
      }
    }
    if (isCheckbox(element)) {
      const checkboxValue = element.getAttribute('value')
      if (!checkboxValue) {
        throw new Error('checkbox must have \'value\' attribute')
      }
      if (value.indexOf(checkboxValue) === -1) {
        showErrorForFormElement(
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
    if (value === '' && !requiredAttribute) {
      return true
    }
    const validationPattern = VALIDATION_PATTERNS[validationPatternAttribute] || new RegExp(validationPatternAttribute, 'ig')
    if (!validationPattern.test(value)) {
      showErrorForFormElement(
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

function isCheckbox (element) {
  return element instanceof HTMLInputElement &&
    element.type.toLowerCase() === 'checkbox'
}

function isFile (element) {
  return element instanceof HTMLInputElement &&
    element.type.toLowerCase() === 'file'
}

function showErrorForFormElement (form, element, errorMessage, elementErrorClass, messageBoxErrorClass) {
  let elementWithErrorMessageBox
  let messageBox
  if (errorMessage) {
    if (element.parentElement.tagName.toLowerCase() === 'label') {
      elementWithErrorMessageBox = element.parentElement
    } else {
      if (element === form) {
        elementWithErrorMessageBox = element
      } else {
        elementWithErrorMessageBox = document.createElement('label')
        elementWithErrorMessageBox.appendChild(element)
        element.parentElement.replaceChild(
          elementWithErrorMessageBox,
          element
        )
      }
    }
    messageBox = document.createElement('span')
    messageBox.innerText = errorMessage
    elementWithErrorMessageBox.appendChild(messageBox)
    form.validationErrorBoxes.push(messageBox)
    if (messageBoxErrorClass) {
      messageBox.classList.add(messageBoxErrorClass)
    }
  }
  if (elementErrorClass) {
    element.classList.add(elementErrorClass)
    form.elementsWithValidationError.push(element)
  }
  const listener = () => {
    if (messageBox) {
      messageBox.parentElement.removeChild(messageBox)
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

function hideAllErrorsForForm (form) {
  form.validationErrorBoxes.forEach(messageBox => {
    if (messageBox.parentNode) {
      messageBox.parentNode.removeChild(
        messageBox
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

function scrollToFirstErrorBox (form) {
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

function assignAndReturnValueToRequestBody (requestBodySubObject, remainingPropertyPath, properyValue) {
  const currentPathPart = remainingPropertyPath[0]
  const restPathParts = remainingPropertyPath.slice(1)

  if (!currentPathPart) {
    return null
  }

  if (currentPathPart.isLiteral) {
    if (Array.isArray(requestBodySubObject)) {
      if (requestBodySubObject[currentPathPart.index] === undefined) {
        requestBodySubObject[currentPathPart.index] = properyValue
      }
      return requestBodySubObject[currentPathPart.index]
    }
    requestBodySubObject[currentPathPart.name] = properyValue
    return requestBodySubObject[currentPathPart.name]
  }

  if (currentPathPart.isArray) {
    if (Array.isArray(requestBodySubObject)) {
      if (requestBodySubObject[currentPathPart.index] === undefined) {
        requestBodySubObject[currentPathPart.index] = []
      }
      return assignAndReturnValueToRequestBody(
        requestBodySubObject[currentPathPart.index],
        restPathParts,
        properyValue
      )
    }
    if (requestBodySubObject[currentPathPart.name] === undefined) {
      requestBodySubObject[currentPathPart.name] = []
    }
    return assignAndReturnValueToRequestBody(
      requestBodySubObject[currentPathPart.name],
      restPathParts,
      properyValue
    )
  }

  if (currentPathPart.isObject) {
    if (Array.isArray(requestBodySubObject)) {
      if (requestBodySubObject[currentPathPart.index] === undefined) {
        requestBodySubObject[currentPathPart.index] = {}
      }
      return assignAndReturnValueToRequestBody(
        requestBodySubObject[currentPathPart.index],
        restPathParts,
        properyValue
      )
    }
    if (requestBodySubObject[currentPathPart.name] === undefined) {
      requestBodySubObject[currentPathPart.name] = {}
    }
    return assignAndReturnValueToRequestBody(
      requestBodySubObject[currentPathPart.name],
      restPathParts,
      properyValue
    )
  }

  return null
}

function returnValueByPropertyPath (requestBodySubObject, remainingPropertyPath) {
  const currentPathPart = remainingPropertyPath[0]
  const restPathParts = remainingPropertyPath.slice(1)

  if (!currentPathPart) {
    return null
  }

  if (currentPathPart.isLiteral) {
    if (Array.isArray(requestBodySubObject)) {
      return requestBodySubObject[currentPathPart.index]
    }
    return requestBodySubObject[currentPathPart.name]
  }

  if (currentPathPart.isArray) {
    if (Array.isArray(requestBodySubObject)) {
      return returnValueByPropertyPath(
        requestBodySubObject[currentPathPart.index],
        restPathParts
      )
    }
    return returnValueByPropertyPath(
      requestBodySubObject[currentPathPart.name],
      restPathParts
    )
  }

  if (currentPathPart.isObject) {
    if (Array.isArray(requestBodySubObject)) {
      return returnValueByPropertyPath(
        requestBodySubObject[currentPathPart.index],
        restPathParts
      )
    }
    return returnValueByPropertyPath(
      requestBodySubObject[currentPathPart.name],
      restPathParts
    )
  }

  return null
}

function buildFullPathOfProperyForRequestBodyByFormElementPosition(formElement, properyPath, valueIsForQueryObject) {
  if (valueIsForQueryObject) {
    properyPath.unshift({
      name: formElement.name,
      isLiteral: true
    })
    return
  }

  const isArray = formElement.tagName.toLowerCase() === 'e-form-array'
  const isObject = formElement.tagName.toLowerCase() === 'e-form-object'
  const isLiteral = !isArray && !isObject

  const closestForm = formElement.closest('form')

  let closestFormArray
  let closestFormObject
  if (isArray) {
    closestFormArray = formElement.parentElement.closest('e-form-array')
    closestFormObject = formElement.closest('e-form-object')
  } else if (isObject) {
    closestFormArray = formElement.closest('e-form-array')
    closestFormObject = formElement.parentElement.closest('e-form-object')
  } else {
    closestFormArray = formElement.closest('e-form-array')
    closestFormObject = formElement.closest('e-form-object')
  }

  let theMostClosest = closestForm
  if (
    formElement !== closestFormArray && (
      (closestFormArray && !closestFormObject && closestForm.contains(closestFormArray)) ||
      (closestFormObject && closestFormArray && closestFormObject.contains(closestFormArray))
    )
  ) {
    theMostClosest = closestFormArray
  } else if (
    formElement !== closestFormObject && (
      (closestFormObject && !closestFormArray && closestForm.contains(closestFormObject)) ||
      (closestFormObject && closestFormArray && closestFormArray.contains(closestFormObject))
    )
  ) {
    theMostClosest = closestFormObject
  }

  if (closestForm == theMostClosest) {
    properyPath.unshift({
      name: formElement.name,
      isLiteral,
      isArray,
      isObject
    })
    return
  }

  if (closestFormArray == theMostClosest) {
    const formElementQuerySelector = [
      'input',
      'select',
      'textarea',
      'e-local-storage-value',
      'e-session-storage-value',
      'e-form-dynamic-value',
      'e-form-array',
      'e-form-object'
    ].join(', ')

    const topLevelElements = [...closestFormArray.querySelectorAll(formElementQuerySelector)]
      .filter((el) => {
        if (el === formElement) {
          return true
        }

        if (formElement.contains(el)) {
          return false
        }

        if (el.contains(formElement)) {
          return false
        }

        if (!closestFormArray.contains(el)) {
          return false
        }

        const elClosestFormArray = el.closest('e-form-array')
        const elClosestFormObject = el.closest('e-form-object')

        if (elClosestFormArray !== el && elClosestFormArray !== closestFormArray) {
          return false
        }

        if (elClosestFormObject !== el && elClosestFormObject !== closestFormObject) {
          return false
        }
        
        return true
      })
    const formElementIndex = topLevelElements.indexOf(formElement)

    properyPath.unshift({
      name: formElement.name,
      index: formElementIndex,
      isLiteral,
      isArray,
      isObject
    })
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      closestFormArray,
      properyPath,
      valueIsForQueryObject
    )
    return
  }

  if (closestFormObject == theMostClosest) {
    properyPath.unshift({
      name: formElement.name,
      isLiteral,
      isArray,
      isObject
    })
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      closestFormObject,
      properyPath,
      valueIsForQueryObject
    )
    return
  }
}

function requestBodyAndQueryObject (form) {
  const requestBody = {}
  const queryObject = {}
  retrievedValuesFromInputsForRequestBodyAndQueryObject(form.inputs, requestBody, queryObject)
  retrievedValuesFromSelectsForRequestBodyAndQueryObject(form.selects, requestBody, queryObject)
  retrievedValuesFromTextareasForRequestBodyAndQueryObject(form.textareas, requestBody, queryObject)
  retrievedValuesFromLocalStorageForRequestBodyAndQueryObject(form.localStorageValues, requestBody, queryObject)
  retrievedValuesFromSessionStorageForRequestBodyAndQueryObject(form.sessionStorageValues, requestBody, queryObject)
  retrievedDynamicValuesForRequestBodyAndQueryObject(form.dynamicValues, requestBody, queryObject)
  return { requestBody, queryObject }
}

function retrievedValuesFromInputsForRequestBodyAndQueryObject (inputs, requestBody, queryObject) {
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index]
    const valueIsForQueryObject = input.hasAttribute('data-is-query-param')
    const obj = valueIsForQueryObject ? queryObject : requestBody
    if (!input.name) {
      continue
    }
    const properyPath = []
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      input,
      properyPath,
      valueIsForQueryObject
    )
    if (input.type.toLowerCase() === 'radio') {
      if (input.checked) {
        assignAndReturnValueToRequestBody(
          obj,
          properyPath,
          input.value
        )
      }
    } else if (input.type.toLowerCase() === 'checkbox') {
      const exitingCheckboxValue = returnValueByPropertyPath(
        obj,
        properyPath
      )
      const requestBodyCheckboxPart = assignAndReturnValueToRequestBody(
        obj,
        properyPath,
        exitingCheckboxValue || []
      )
      const inputValue = input.value
      if (!inputValue) {
        throw new Error('checkbox must have \'value\' attribute')
      }
      if (input.checked) {
        requestBodyCheckboxPart.push(inputValue)
      } else if (input.hasAttribute('unchecked-value')) {
        requestBodyCheckboxPart.push(input.getAttribute('unchecked-value'))
      }
    } else if (input.type.toLowerCase() === 'file') {
      assignAndReturnValueToRequestBody(
        obj,
        properyPath,
        input.filesInfo
      )
    } else {
      assignAndReturnValueToRequestBody(
        obj,
        properyPath,
        input.value
      )
    }
  }
}

function retrievedValuesFromSelectsForRequestBodyAndQueryObject (selects, requestBody, queryObject) {
  for (let index = 0; index < selects.length; index++) {
    const select = selects[index]
    const valueIsForQueryObject = select.hasAttribute('data-is-query-param')
    const obj = valueIsForQueryObject ? queryObject : requestBody
    if (!select.name) {
      throw new Error(`select ${select} has no name`)
    }
    const properyPath = []
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      select,
      properyPath,
      valueIsForQueryObject
    )
    assignAndReturnValueToRequestBody(
      obj,
      properyPath,
      select.value
    )
  }
}

function retrievedValuesFromTextareasForRequestBodyAndQueryObject (textareas, requestBody, queryObject) {
  for (let index = 0; index < textareas.length; index++) {
    const textarea = textareas[index]
    const valueIsForQueryObject = textarea.hasAttribute('data-is-query-param')
    const obj = valueIsForQueryObject ? queryObject : requestBody
    if (!textarea.name) {
      throw new Error(`textarea ${textarea} has no name`)
    }
    const properyPath = []
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      textarea,
      properyPath,
      valueIsForQueryObject
    )
    assignAndReturnValueToRequestBody(
      obj,
      properyPath,
      textarea.value
    )
  }
}

function retrievedValuesFromLocalStorageForRequestBodyAndQueryObject (localStorageValues, requestBody, queryObject) {
  for (let index = 0; index < localStorageValues.length; index++) {
    const localStorageValue = localStorageValues[index]
    const valueIsForQueryObject = localStorageValue.hasAttribute('data-is-query-param')
    const obj = valueIsForQueryObject ? queryObject : requestBody
    if (!localStorageValue.name) {
      throw new Error(`localStorageValue ${localStorageValue} has no name`)
    }
    const properyPath = []
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      localStorageValue,
      properyPath,
      valueIsForQueryObject
    )
    assignAndReturnValueToRequestBody(
      obj,
      properyPath,
      localStorageValue.value
    )
  }
}

function retrievedValuesFromSessionStorageForRequestBodyAndQueryObject (sessionStorageValues, requestBody, queryObject) {
  for (let index = 0; index < sessionStorageValues.length; index++) {
    const sessionStorageValue = sessionStorageValues[index]
    const valueIsForQueryObject = sessionStorageValue.hasAttribute('data-is-query-param')
    const obj = valueIsForQueryObject ? queryObject : requestBody
    if (!sessionStorageValue.name) {
      throw new Error(`sessionStorageValue ${sessionStorageValue} has no name`)
    }
    const properyPath = []
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      sessionStorageValue,
      properyPath,
      valueIsForQueryObject
    )
    assignAndReturnValueToRequestBody(
      obj,
      properyPath,
      sessionStorageValue.value
    )
  }
}

function retrievedDynamicValuesForRequestBodyAndQueryObject (dynamicValues, requestBody, queryObject) {
  for (let index = 0; index < dynamicValues.length; index++) {
    const dynamicValue = dynamicValues[index]
    const valueIsForQueryObject = dynamicValue.hasAttribute('data-is-query-param')
    const obj = valueIsForQueryObject ? queryObject : requestBody
    if (!dynamicValue.name) {
      throw new Error(`dynamicValue ${dynamicValue} has no name`)
    }
    if (!dynamicValue.hasAttribute('data-bound-to')) {
      throw new Error(`dynamicValue ${dynamicValue} has no data-bound-to attribute`)
    }
    const properyPath = []
    buildFullPathOfProperyForRequestBodyByFormElementPosition(
      dynamicValue,
      properyPath,
      valueIsForQueryObject
    )
    assignAndReturnValueToRequestBody(
      obj,
      properyPath,
      dynamicValue.value()
    )
  }
}
