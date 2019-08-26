'use strict'

const HTMLTunedElement = require('./../objects/HTMLTunedElement')
// const RequestFromAjaxRequest = require('@page-libs/ajax')

class EForm extends HTMLTunedElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return ['data-request-url', 'data-request-headers', 'data-request-button']
  }

  render () {
    const form = this // .replacedWith(document.createElement('form'))
    const inputs = form.getElementsByTagName('input')
    const fileInputs = this.filteredFileInputs(inputs)
    const selects = form.getElementsByTagName('select')
    const textareas = form.getElementsByTagName('textarea')
    const localStorageValues = form.getElementsByTagName('e-local-storage-value')
    const memoryStorageValues = form.getElementsByTagName('e-memory-storage-value')
    const requestButton = document.getElementById(form.getAttribute('data-request-button').split('#')[1])
    const requestBody = {}
    this.tuneFileInputs(fileInputs, requestBody, requestButton)
    requestButton.addEventListener('click', () => {
      this.retrievedValuesFromInputsForRequestBody(inputs, requestBody)
      this.retrievedValuesFromSelectsForRequestBody(selects, requestBody)
      this.retrievedValuesFromTextareasForRequestBody(textareas, requestBody)
      this.retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody)
      this.retrievedValuesFromMemoryStorageForRequestBody(memoryStorageValues, requestBody)
      console.log(requestBody)
    })
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

  tuneFileInputs (fileInputs, requestBody, requestButton) {
    for (let index = 0; index < fileInputs.length; index++) {
      this.tuneFileInput(fileInputs[index], requestBody, requestButton)
    }
  }

  tuneFileInput (fileInput, requestBody, requestButton) {
    fileInput.addEventListener('change', () => {
      this.readFilesContentForRequestBody(fileInput, requestBody, requestButton)
    })
  }

  readFilesContentForRequestBody (fileInput, requestBody, requestButton) {
    requestBody[fileInput.name] = []
    for (let index = 0; index < fileInput.files.length; index++) {
      this.readFileContentForRequestBody(fileInput, requestBody, requestButton, index)
    }
  }

  readFileContentForRequestBody (fileInput, requestBody, requestButton, index) {
    const file = fileInput.files[index]
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadstart = () => {
      requestButton.setAttribute('disabled', true)
    }
    reader.onload = () => {
      file.content = reader.result
      requestBody[fileInput.name][index] = file
      requestButton.removeAttribute('disabled')
    }
    reader.onabort = () => {
      requestButton.removeAttribute('disabled')
    }
    reader.onprogress = () => {

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

module.exports = EForm
