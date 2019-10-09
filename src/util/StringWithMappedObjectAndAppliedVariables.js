'use string'

class StringWithMappedObjectAndAppliedVariables {
  constructor (str, obj, objName) {
    this.str = str
    this.obj = obj
    this.objName = objName
  }

  value () {
    this.str = this.str
      .replace(/\${((\s)?([^{}$]+\s)?(localStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, (match, p1) => {
        // eslint-disable-next-line no-undef
        const expression = match.replace(/localStorage(\.[^{}$\s]+)?/g, (match, p1) => {
          return `'${localStorage.getItem(p1.split('.')[1])}'`
        })
        // eslint-disable-next-line no-eval
        return expression
      })
      .replace(/\${((\s)?([^{}$]+\s)?(sessionStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, (match, p1) => {
        // eslint-disable-next-line no-undef
        const expression = match.replace(/sessionStorage(\.[^{}$\s]+)?/g, (match, p1) => {
          return `'${sessionStorage.getItem(p1.split('.')[1])}'`
        })
        // eslint-disable-next-line no-eval
        return expression
      })
      .replace(/\${((\s)?([^{}$]+\s)?(urlParams)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, (match, p1) => {
        const expression = match.replace(/urlParams(\.[^{}$\s]+)?/g, (match, p1) => {
          // eslint-disable-next-line no-undef, no-eval
          return eval(`'urlParams${p1}'`)
        })
        // eslint-disable-next-line no-eval
        return expression
      })
    if (this.obj) {
      return this.str.replace(
        new RegExp(
          `\\$\{((\\s)?([^{}$]+\\s)?(${this.objName})(\\.[^\\s{}$]+)?(\\s)?(\\s[^{}$]+)?)}`, 'g'
        ),
        (match, p1) => {
          // eslint-disable-next-line no-unused-vars
          const obj = this.obj
          const objName = this.objName
          const expression = `
            const ${objName} = obj['${objName}']
            ${p1}
          `
          // eslint-disable-next-line no-eval
          const res = eval(expression)
          if (typeof res === 'object') {
            return JSON.stringify(res)
          }
          return res
        }
      )
    }
    return this.str.replace(/\$\{([^{}\s]+)\}/g, (match, p1) => {
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
