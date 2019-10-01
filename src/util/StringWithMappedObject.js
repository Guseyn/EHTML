'use string'

class StringWithMappedObject {
  constructor (str, obj, objName) {
    this.str = str
    this.obj = obj
    this.objName = objName
  }

  value () {
    return this.str.replace(
      new RegExp(
        `\\$\{(([^{}$]+)?(\\${this.objName}(\\.[^\\s{}$]+)?)([^{}$]+)?)}`, 'g'
      ),
      (match, p1, offset, string) => {
        const obj = this.obj
        const objName = this.objName
        try {
          const expression = p1.replace(
            new RegExp(
              `\\${this.objName}(\\.[^\\s{}$]+)?`, 'g'
            ), (match, p1) => {
              // eslint-disable-next-line no-eval
              const value = p1 ? eval(`obj[objName]${p1}`) : obj[objName]
              if (typeof value === 'object') {
                return JSON.stringify(value)
              }
              return value
          })
          // eslint-disable-next-line no-eval
          const res = eval(`'${expression}'`)
          if (typeof res === 'object') {
            return JSON.stringify(res)
          }
          return res
        } catch (e) {
          console.log(e)
          return match
        }
      }
    )
  }
}

module.exports = StringWithMappedObject
