'use strict'

class ElementWithMappedObject {
  constructor (elm, obj) {
    this.elm = elm
    this.obj = obj
  }

  value () {
    if (this.elm == null) {
      throw new Error('Mapping element is not found')
    }
    if (!this.isTemplate(this.elm)) {
      throw new Error('Mapping element must be <template>')
    }
    const elmContentNode = document.importNode(this.elm.content, true)
    const objName = this.elm.getAttribute('data-object-name')
    if (!objName) {
      throw new Error('Mapping element must have attribute "data-object-name"')
    }
    const initialization = `
      const ${objName} = obj
      const mappingElmAttrs = mappingElement.getAttributeNames().reduce((acc, name) => {
        return {...acc, [name]: mappingElement.getAttribute(name)};
      }, {})
    `
    const mappingElement = this.elm
    this.map(mappingElement, elmContentNode, this.obj, initialization)
    this.releaseTemplate(elmContentNode)
    return this.elm
  }

  releaseTemplate (elmContentNode) {
    if (this.isTemplate(this.elm, 'e-reusable')) {
      if (this.elm.hasAttribute('data-prepend-to')) {
        const parentNode = document.querySelector(this.elm.getAttribute('data-prepend-to'))
        if (!parentNode) {
          throw new Error('element is not found by the selector in the attribute "data-prepend-to"')
        }
        parentNode.prepend(elmContentNode)
      } else if (this.elm.hasAttribute('data-append-to')) {
        const parentNode = document.querySelector(this.elm.getAttribute('data-append-to'))
        if (!parentNode) {
          throw new Error('element is not found by the selector in the attribute "data-append-to"')
        }
        parentNode.append(elmContentNode)
      } else if (this.elm.hasAttribute('data-insert-into')) {
        const parentNode = document.querySelector(this.elm.getAttribute('data-insert-into'))
        if (!parentNode) {
          throw new Error('element is not found by the selector in the attribute "data-insert-into"')
        }
        parentNode.innerHTML = ''
        parentNode.append(elmContentNode)
      } else {
        this.elm.parentNode.insertBefore(elmContentNode, this.elm)
      }
    } else {
      this.elm.parentNode.replaceChild(elmContentNode, this.elm)
    }
  }

  map (mappingElement, elm, obj, initialization) {
    this.iterateChildNodes(
      elm, (node) => {
        if (this.isTemplate(node, 'e-for-each')) {
          this.activateEForEach(mappingElement, node, obj, initialization)
        } else if (this.isTemplate(node, 'e-if')) {
          this.activateEIf(mappingElement, node, obj, initialization)
        } else {
          this.iterateAttributes(
            node, (attr) => {
              if (this.isForProcessing(attr)) {
                node.setAttribute(
                  attr.name,
                  // eslint-disable-next-line no-eval
                  this.appliedExpressionsInString(
                    mappingElement, attr.value, initialization, obj
                  )
                )
              }
              if (attr.name === 'data-text') {
                const textNode = document.createTextNode(
                  attr.value
                )
                if (node.childNodes.length === 0) {
                  node.appendChild(textNode)
                } else {
                  node.insertBefore(textNode, node.childNodes[0])
                }
                node.removeAttribute('data-text')
              } else if (attr.name === 'data-value') {
                node.value = attr.value
                node.removeAttribute('data-value')
              } else if (attr.name === 'data-inner-html') {
                node.innerHTML = attr.value
                node.removeAttribute('data-inner-html')
              }
            }
          )
        }
      }
    )
  }

  iterateChildNodes (elm, func) {
    const childNodes = Array.from(elm.childNodes)
    childNodes.forEach(node => {
      func(node)
      if (node.childNodes.length !== 0) {
        this.iterateChildNodes(node, func)
      }
    })
  }

  iterateAttributes (elm, func) {
    if (elm.attributes) {
      const elmAttributes = Array.from(elm.attributes)
      elmAttributes.forEach(attr => {
        func(attr)
      })
    }
  }

  isForProcessing (attr) {
    return [
      'data-actions-on-response',
      'data-list-to-iterate',
      'data-item-name',
      'data-bound-to'
    ].indexOf(attr.name) === -1 &&
      /\$\{([^${}]+)\}/gm.test(attr.value)
  }

  isTemplate (node, type) {
    const nodeName = node.nodeName.toLowerCase()
    if (!type) {
      return nodeName === 'template'
    }
    return nodeName === 'template' && node.getAttribute('is') === type
  }

  activateEIf (mappingElement, node, obj, initialization) {
    const toDisplayExpression = node.getAttribute('data-condition-to-display')
    if (!toDisplayExpression) {
      throw new Error('e-if must have "data-condition-to-display" attribute')
    }
    const toDisplay = this.appliedExpressionsInString(
      mappingElement, toDisplayExpression, initialization, obj
    ).trim()
    if (toDisplay === 'true') {
      const contentNode = document.importNode(node.content, true)
      this.map(mappingElement, contentNode, obj, initialization)
      node.parentNode.insertBefore(contentNode, node)
    }
    node.parentNode.removeChild(node)
  }

  activateEForEach (mappingElement, node, obj, initialization) {
    const listDefinitionExpression = node.getAttribute('data-list-to-iterate')
    const itemName = node.getAttribute('data-item-name')
    if (!listDefinitionExpression) {
      throw new Error('e-for-each must have "data-list-to-iterate" attribute')
    }
    if (!itemName) {
      throw new Error('e-for-each must have "data-item-name" attribute')
    }
    const listDefinitionExpressionBody = this.getBodyOfExpression(listDefinitionExpression)
    // eslint-disable-next-line no-eval
    const list = eval(
      `
        ${initialization}
        ${listDefinitionExpressionBody}
      `
    )
    const listFragment = document.createDocumentFragment()
    list.forEach((item, index) => {
      item.index = index + 1
      const itemInitialization = `
        ${initialization}
        const ${itemName} = ${listDefinitionExpressionBody}[${index}]
      `
      const itemContentNode = document.importNode(node.content, true)
      this.map(mappingElement, itemContentNode, obj, itemInitialization)
      listFragment.appendChild(itemContentNode)
    })
    node.parentNode.replaceChild(listFragment, node)
  }

  appliedExpressionsInString (mappingElement, string, initialization, obj) {
    return string.replace(/\$\{([^${}]+)\}/gm, (match, p1) => {
      // eslint-disable-next-line no-eval
      const appliedExpression = eval(
        `
          ${initialization}
          ${p1}
        `
      )
      if (typeof appliedExpression === 'object') {
        return JSON.stringify(appliedExpression)
      }
      return appliedExpression
    })
  }

  getBodyOfExpression (expression) {
    return expression.replace(/\$\{([^${}]+)\}/gm, (match, p1) => {
      return p1
    })
  }
}

module.exports = ElementWithMappedObject
