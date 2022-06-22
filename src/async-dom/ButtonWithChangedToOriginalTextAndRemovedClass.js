'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ButtonWithChangedToOriginalTextAndRemovedClass extends AsyncObject {
  constructor (button, className) {
    super(button, className)
  }

  syncCall () {
    return (button, className) => {
      if (className) {
        button.classList.remove(className)
      }
      if (button.originalInnerText) {
        button.innerText = button.originalInnerText
      }
      return button
    }
  }
}

module.exports = ButtonWithChangedToOriginalTextAndRemovedClass
