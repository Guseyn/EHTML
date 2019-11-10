'use string'

const uuidv4 = require('uuid/v4')

class StringWithMappedObjectAndAppliedVariables {
  constructor (str, obj, objName) {
    this.str = str
    this.obj = obj
    this.objName = objName
  }

  value () {
    this.str = this.stringWithVariables(this.str)
    if (this.obj) {
      this.str = this.stringWithMappedObject(
        this.str, this.obj, this.objName
      )
      return this.str
    }
    return this.evalString(this.str)
  }

  stringWithVariables (str) {
    return str.replace(this.objRegExp('localStorage'), (match, p1) => {
      const expression = match.replace(/localStorage(\.[^{}$\s]+)?/g, (match, p1) => {
        return `'${localStorage.getItem(p1.split('.')[1])}'`
      })
      return expression
    }).replace(this.objRegExp('sessionStorage'), (match, p1) => {
      const expression = match.replace(/sessionStorage(\.[^{}$\s]+)?/g, (match, p1) => {
        return `'${sessionStorage.getItem(p1.split('.')[1])}'`
      })
      return expression
    }).replace(this.objRegExp('urlParams'), (match, p1) => {
      const expression = match.replace(/urlParams(\.[^{}$\s]+)?/g, (match, p1) => {
        // eslint-disable-next-line no-eval
        return eval(`'urlParams${p1}'`)
      })
      return expression
    })
  }

  stringWithMappedObject (str, obj, objName) {
    return str.replace(
      this.objRegExp(objName),
      (match, p1, p2, p3, p4, p5) => {
        const expression = `
          const ${objName} = obj['${objName}']
          ${p1}
        `
        try {
          // eslint-disable-next-line no-eval
          const res = eval(expression)
          if (typeof res === 'object') {
            return JSON.stringify(res)
          }
          return res
        } catch (error) {
          const res = match.replace(p5, () => {
            const name = uuidv4()
            window.eMappedObjects[name] = obj[objName]
            return `window.eMappedObjects['${name}']`
          })
          return res
        }
      }
    )
  }

  objRegExp (objName) {
    let objRegExp
    if (window.eMappedRegExps[objName]) {
      objRegExp = window.eMappedRegExps[objName]
    } else {
      objRegExp = new RegExp(
        `\\$\{((\\s)?([^{}$]+(\\s|\\()|[\\s(!]+)?(${objName})(\\.[^\\s{}$]+)?(\\s)?(\\s[^{}$]+)?)}`, 'g'
      )
      window.eMappedRegExps[objName] = objRegExp
    }
    return objRegExp
  }

  evalString (str) {
    return str.replace(/\$\{([^{}\s]+)\}/g, (match, p1) => {
      try {
        // eslint-disable-next-line no-eval
        const res = eval(p1)
        if (typeof res === 'object') {
          return JSON.stringify(res)
        }
        return res
      } catch (error) {
        return match
      }
    })
  }
}

module.exports = StringWithMappedObjectAndAppliedVariables
