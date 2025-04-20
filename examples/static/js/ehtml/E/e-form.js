import responseFromAjaxRequest from 'ehtml/responseFromAjaxRequest'
import evaluatedStringWithParamsFromState from 'ehtml/evaluatedStringWithParamsFromState'
import evaluateStringWithActionsOnProgress from 'ehtml/evaluateStringWithActionsOnProgress'
import evaluateStringWithActionsOnResponse from 'ehtml/evaluateStringWithActionsOnResponse'

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

export default (node) => {
  const form = replaceWithForm(node)
  setupForm(form)
  form.addEventListener('allChildNodesAreObservedByEHTML', () => {
    if (form.hasAttribute('data-request-url')) {
      submit(form, true)
    }
  })
}

function replaceWithForm (node) {
  const form = document.createElement('form')
  form.setAttribute('novalidate', 'true')
  form.setAttribute('data-e-form', 'true')
  for (let i = 0; i < node.attributes.length; i++) {
    form.setAttribute(
      node.attributes[i].name,
      node.attributes[i].value
    )
  }
  onsubmit = () => {
    return false
  }
  form.submit = submit
  form.validationErrorBoxes = []
  form.elementsWithValidationError = []
  while (node.firstChild) {
    const child = node.removeChild(node.firstChild)
    form.appendChild(child)
  }
  node.parentNode.replaceChild(form, node)
  return form
}

function setupForm (form) {
  form.progressBars = form.getElementsByTagName('progress')
  form.inputs = form.getElementsByTagName('input')
  form.selects = form.getElementsByTagName('select')
  form.textareas = form.getElementsByTagName('textarea')
  form.localStorageValues = form.getElementsByTagName('e-local-storage-value')
  form.sessionStorageValues = form.getElementsByTagName('e-session-storage-value')
  form.dynamicValues = form.getElementsByTagName('e-form-dynamic-value')
  form.buttons = form.getElementsByTagName('button')
  form.submit = submit
  tuneFileInputs(filteredFileInputs(form.inputs))
  prepareDifferentFormElements(form)
  prepareProgressBars(form.progressBars)
}

function tuneFileInputs (fileInputs) {
  for (let index = 0; index < fileInputs.length; index++) {
    tuneFileInput(fileInputs[index])
  }
}

function tuneFileInput (fileInput) {
  const readProgressBar = document.querySelector(
    fileInput.getAttribute('data-read-progress-bar')
  )
  fileInput.addEventListener('change', () => {
    readFilesContentForRequestBody(fileInput, readProgressBar)
  })
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
    if (event.lengthComputable) {
      readProgressBar.style.display = ''
      const percentComplete = parseInt((event.loaded / event.total) * 100)
      readProgressBar.value = percentComplete
    }
  }
  reader.onloadend = () => {
    filesRead.count += 1
    if (filesRead.count === filesLength) {
      readProgressBar.style.display = 'none'
    } else {
      readProgressBar.value = 0
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
    form.allElements.push(elm)
    const ajaxIcon = document.querySelector(
      elm.getAttribute('data-ajax-icon')
    )
    if (ajaxIcon) {
      ajaxIcon.style.display = 'none'
    }
  }
}

function prepareProgressBars (progressBars) {
  for (let index = 0; index < progressBars.length; index++) {
    if (progressBars[index]) {
      const progressBar = progressBars[index]
      progressBar.max = 100
      progressBar.value = 0
      progressBar.style.display = 'none'
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
    return encodeURI(`${url}?${queryStringBuffer.join('&')}`)
  }
  return encodeURI(url)
}

function submit (target, targetIsForm) {
  const form = targetIsForm ? target : target.form
  if (!form) {
    throw new Error('you must pass form in submit method like: \'this.submit(this)\'')
  }
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
  if (target.hasAttribute('data-button-ajax-text') && !targetIsForm && !socketName) {
    target.originalInnerText = target.innerText
    target.innerText = target.getAttribute('data-button-ajax-text')
  }

  const { requestBody, queryObject } = requestBodyAndQueryObject(form)

  hideAllErrorsForForm(form)
  validateDifferentFormElements(form, requestBody, queryObject, validations)

  form.isValid = false

  if (isFormValid(form, validations)) {
    form.isValid = true
    if (socketName) {
      if (!window.__ehtmlState__['webSockets'] || !window.__ehtmlState__['webSockets'][socketName]) {
        throw new Error(`socket with name "${socketName}" is not defined or not open yet`)
      }
      const socket = window.__ehtmlState__['webSockets'][socketName]
      if (socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify(requestBody)
        socket.send(message)
      } else {
        throw new Error(`socket with name "${socketName}" is not open`)
      }
      return
    }

    const downloadResponseBodyAsFileWithName = target.getAttribute('data-download-response-body-as-file-with-name')

    const uploadProgressBarSelector = target.getAttribute('data-upload-progress-bar')
    const uploadProgressBar = document.querySelector(uploadProgressBarSelector)

    const progressBarSelector = target.getAttribute('data-progress-bar')
    const progressBar = document.querySelector(progressBarSelector)

    if (target.hasAttribute('data-actions-on-progress')) {
      evaluateStringWithActionsOnProgress(
        target.getAttribute('data-actions-on-progress'),
        target
      )
    }

    if (!target.hasAttribute('data-request-url')) {
      throw new Error('e-form must have "data-request-url" attribute in the element that submits it')
    }

    responseFromAjaxRequest({
      url: urlWithQueryParams(
        evaluatedStringWithParamsFromState(
          target.getAttribute('data-request-url'),
          target.__ehtmlState__,
          target
        ),
        queryObject
      ),
      headers: JSON.parse(
        evaluatedStringWithParamsFromState(
          target.getAttribute('data-request-headers'),
          target.__ehtmlState__,
          target
        ) || '{}'
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
      evaluateStringWithActionsOnResponse(
        target.getAttribute('data-actions-on-response'),
        target.getAttribute('data-response-name'),
        {
          body: responseBodyAsObject,
          statusCode: resObj.statusCode,
          headers: resObj.headers
        },
        target
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
  const nameAttribute = element.getAttribute('name')
  let value = (requestBody[nameAttribute] === undefined) ? queryObject[nameAttribute] : requestBody[nameAttribute]
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

function hideAllErrorsForForm (form) {
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

function retrievedValuesFromSelectsForRequestBodyAndQueryObject (selects, requestBody, queryObject) {
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

function retrievedValuesFromTextareasForRequestBodyAndQueryObject (textareas, requestBody, queryObject) {
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

function retrievedValuesFromLocalStorageForRequestBodyAndQueryObject (localStorageValues, requestBody, queryObject) {
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

function retrievedValuesFromSessionStorageForRequestBodyAndQueryObject (sessionStorageValues, requestBody, queryObject) {
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

function retrievedDynamicValuesForRequestBodyAndQueryObject (dynamicValues, requestBody, queryObject) {
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
