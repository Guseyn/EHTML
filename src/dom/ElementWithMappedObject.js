'use strict'

class ElementWithMappedObject {
  constructor (elm, obj) {
    this.elm = elm
    this.obj = obj
  }

  value () {
    if (!this.isTemplate(this.elm)) {
      throw new Error('Mapping element must be <template>')
    }
    const elmContentNode = document.importNode(this.elm.content, true)
    const objName = this.elm.getAttribute('data-object-name')
    if (!objName) {
      throw new Error('Mapping element must have attribute "data-object-name"')
    }
    const initialization = `const ${objName} = obj`
    this.map(elmContentNode, this.obj, initialization)
    this.elm.parentNode.replaceChild(elmContentNode, this.elm)
    return this.elm
  }

  map (elm, obj, initialization) {
    this.iterateChildNodes(
      elm, (node) => {
        if (this.isEForEach(node)) {
          this.activateEForEach(node, obj, initialization)
        } else if (this.isEIf(node)) {
          this.activateEIf(node, obj, initialization)
        } else {
          this.iterateAttributes(
            node, (attr) => {
              if (/\$\{([^${}]+)\}/g.test(attr.value)) {
                node.setAttribute(
                  attr.name,
                  // eslint-disable-next-line no-eval
                  this.appliedExpressionsInString(
                    attr.value, initialization, obj
                  )
                )
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
                }
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

  isTemplate (node) {
    return node.nodeName.toLowerCase() === 'template'
  }

  isEForEach (node) {
    return this.isTemplate(node) && node.getAttribute('is') === 'e-for-each'
  }

  isEIf (node) {
    return this.isTemplate(node) && node.getAttribute('is') === 'e-if'
  }

  activateEIf (node, obj, initialization) {
    const toDisplayExpression = node.getAttribute('data-condition-to-display')
    if (!toDisplayExpression) {
      throw new Error('e-if must have "data-condition-to-display" attribute')
    }
    const toDisplay = this.appliedExpressionsInString(
      toDisplayExpression, initialization, obj
    )
    if (toDisplay) {
      const contentNode = this.clonedContentOfTemplate(node)
      this.map(contentNode, obj, initialization)
      node.parentNode.insertBefore(contentNode, node)
    }
    node.parentNode.removeChild(node)
  }

  activateEForEach (node, obj, initialization) {
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
    list.forEach((item, index) => {
      item.index = index + 1
      const itemInitialization = `
        ${initialization}
        const ${itemName} = ${listDefinitionExpressionBody}[${index}]
      `
      const itemContentNode = document.importNode(node.content, true)
      this.map(itemContentNode, obj, itemInitialization)
      node.parentNode.insertBefore(itemContentNode, node)
    })
    node.parentNode.removeChild(node)
  }

  appliedExpressionsInString (string, initialization, obj) {
    return string.replace(/\$\{([^${}]+)\}/g, (match, p1) => {
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
    return expression.replace(/^\$\{([^${}]+)\}$/g, (match, p1) => {
      return p1
    })
  }
}

module.exports = ElementWithMappedObject
