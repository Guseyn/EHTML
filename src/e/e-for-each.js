'use strict'

const StringWithMappedObjectAndAppliedVariables = require('./../util/StringWithMappedObjectAndAppliedVariables')
// const StringBuffer = require('./../util/StringBuffer')

const E = require('./../E')

E(
  'e-for-each',
  class extends HTMLTemplateElement {
    constructor () {
      super()
    }

    onRender () {}

    activate (obj, objName) {
      const list = JSON.parse(
        new StringWithMappedObjectAndAppliedVariables(
          this.getAttribute('data-list-to-iterate'), obj, objName
        ).value()
      )
      console.log(list)
    }
  },
  { extends: 'template' }
)
