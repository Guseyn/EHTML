'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ButtonWithChangedTextAndAddedClass extends AsyncObject {
  constructor (button, text, className) {
    super(button, text, className)
  }

  syncCall () {
    return (button, text, className) => {
      if (className) {
        button.classList.add(className)
      }
      if (text) {
        button.originalInnerText = button.innerText
        button.innerText = text
      }
      return button
    }
  }
}

module.exports = ButtonWithChangedTextAndAddedClass
