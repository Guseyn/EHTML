'use strict'

const { AsyncObject } = require('@cuties/cutie')
const MemoryStorage = require('./src/global-objects/MemoryStorage')

let id = 0
const getNextId = () => {
  return id++
}

global.document = {
  createTextNode: (text) => {
    return {
      nodeValue: text
    }
  }
}

global.localStorage = {
  items: [],
  getItem: (key) => {
    return global.localStorage.items[key]
  },
  setItem: (key, value) => {
    global.localStorage.items[key] = value
  }
}

global.memoryStorage = new MemoryStorage()

const elementWithAttribute = (attrName, value, ...children) => {
  const attributes = []
  attributes[0] = {
    name: attrName,
    value: value
  }
  const elm = {
    id: getNextId(),
    attributes: attributes,
    value: '',
    childNodes: children,
    getAttribute: (attrName) => {
      for (let i = 0; i < elm.attributes.length; i++) {
        if (elm.attributes[i].name === attrName) {
          return elm.attributes[i].value
        }
      }
      return elm.attributes[attrName]
    },
    setAttribute: (attrName, value) => {
      for (let i = 0; i < elm.attributes.length; i++) {
        if (elm.attributes[i].name === attrName) {
          elm.attributes[i].value = value
          return
        }
      }
      elm.attributes[elm.attributes.length] = {
        name: attrName,
        value: value
      }
    },
    removeAttribute: (attrName) => {
      for (let i = 0; i < elm.attributes.length; i++) {
        if (elm.attributes[i].name === attrName) {
          elm.attributes.splice(i, 1)
          return
        }
      }
    },
    appendChild: (child) => {
      elm.childNodes.unshift(child)
    },
    insertBefore: (child, beforeChild) => {
      let index = 0;
      /* for (let i = 0; i < elm.childNodes.length; i++) {
        if (beforeChild.id === elm.childNodes[i].id) {
          index = i
          break
        }
      } */
      elm.childNodes.splice(index, 0, child)
    }
  }
  return elm
}

// async object that gets only data from object
class ObjWithNoFuncs extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      this.objWithNoFuncs(elm)
      return elm
    }
  }

  objWithNoFuncs (obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'function') {
        delete obj[key]
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach(objValue => {
          this.objWithNoFuncs(objValue)
        })
      } else if (typeof obj[key] === 'object') {
        this.objWithNoFuncs(obj[key])
      }
    }
  }
}

module.exports = {
  elementWithAttribute,
  ObjWithNoFuncs
}
