const matchHtmlRegExp = /["'&<>]/

function escapeHtml (str) {
  const match = matchHtmlRegExp.exec(str)
  if (match !== null) {
    let escape
    let html = ''
    let index
    let lastIndex = 0
    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34: // "
          escape = '&quot;'
          break
        case 38: // &
          escape = '&amp;'
          break
        case 39: // '
          escape = '&#39;'
          break
        case 60: // <
          escape = '&lt;'
          break
        case 62: // >
          escape = '&gt;'
          break
        default:
          continue
      }
      if (lastIndex !== index) {
        html += str.substring(lastIndex, index)
      }
      lastIndex = index + 1
      html += escape
    }
    return lastIndex !== index
      ? html + str.substring(lastIndex, index)
      : html
  }
  return str
}

class PrintWriter {
  constructor (indentString) {
    this.buffer = []
    this.indentString = indentString
    this.objects = []
    this._printSelectionEndAtNewLine = false
  }

  checkCircular (object) {
    for (const obj of this.objects) {
      if (object === obj) {
        throw new Error('Cannot pretty print object with circular reference')
      }
    }
    this.objects.push(object)
  }

  print (str) {
    this.buffer.push(str)
  }

  newLine () {
    if (this._printSelectionEndAtNewLine) {
      this.printSelectionEnd()
      this._printSelectionEndAtNewLine = false
    } else {
      this.buffer.push('<br>')
    }
  }

  space () {
    this.buffer.push('&nbsp;')
  }

  indent (len) {
    if (len > 0) {
      let res = ''
      for (let i = 0; i < len; i++) {
        res += this.indentString
      }
      this.buffer.push(res)
    }
  }

  printKey (key) {
    this.buffer.push('"')
    this.buffer.push(`<span class="json-key">${escapeHtml(key)}</span>`)
    this.buffer.push('"')
  }

  printString (value) {
    this.buffer.push('"')
    this.buffer.push(`<span class="json-string">${escapeHtml(value)}</span>`)
    this.buffer.push('"')
  }

  printBoolean (value) {
    this.buffer.push(`<span class="json-boolean">${value}</span>`)
  }

  printNumber (value) {
    this.buffer.push(`<span class="json-number">${value}</span>`)
  }

  printSelectionStart () {
    this.buffer.push('</div>')
    this.buffer.push('<div class="json-pretty json-selected">')
  }

  printSelectionEnd () {
    this.buffer.push('</div>')
    this.buffer.push('<div class="json-pretty">')
  }

  set printSelectionEndAtNewLine (value) {
    this._printSelectionEndAtNewLine = value
  }

  toString () {
    return this.buffer.join('')
  }
}

function printObject (object, out, idt, selection, options) {
  out.checkCircular(object)
  out.print('{')
  out.newLine()
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = object[key]
    if (selection === value) {
      out.printSelectionStart()
    }
    out.indent(idt + 1)
    out.printKey(key)
    out.print(':')
    out.space()
    switch (typeof value) {
      case 'number':
        out.printNumber(value)
        break
      case 'boolean':
        out.printBoolean(value)
        break
      case 'string':
        out.printString(value)
        break
      case 'object':
        if (value === null) {
          out.print('null')
        } else if (Array.isArray(value)) {
          printArray(value, out, idt + 1, selection, options)
        } else {
          printObject(value, out, idt + 1, selection, options)
        }
        break
      case 'undefined':
        out.print('undefined')
        break
      default:
        throw new Error(`Don't know what to do with ${typeof value}`)
    }
    if (i < keys.length - 1) {
      out.print(',')
    }
    out.newLine()
  }
  out.indent(idt)
  out.print('}')
  if (selection === object) {
    out.printSelectionEndAtNewLine = true
  }
}

function printArray (array, out, idt, selection, options) {
  out.checkCircular(array)
  out.print('[')
  out.newLine()
  for (let i = 0; i < array.length; i++) {
    const value = array[i]
    if (selection === value) {
      out.printSelectionStart()
    }
    out.indent(idt + 1)
    switch (typeof value) {
      case 'number':
        out.printNumber(value)
        break
      case 'boolean':
        out.printBoolean(value)
        break
      case 'string':
        out.printString(value)
        break
      case 'object':
        if (value == null) {
          out.print('null')
        } else {
          printObject(value, out, idt + 1, selection, options)
        }
        break
      case 'undefined':
        out.print('undefined')
        break
      default:
        throw new Error(`Don't know what to do with ${typeof value}`)
    }
    if (i < array.length - 1) {
      out.print(',')
    }
    out.newLine()
  }
  out.indent(idt)
  out.print(']')
  if (selection === array) {
    out.printSelectionEndAtNewLine = true
  }
}

export default function (object, selection, options) {
  if (typeof object !== 'undefined' && object != null) {
    const opts = { indent: '&nbsp;&nbsp;', ...options }
    const out = new PrintWriter(opts.indent)
    if (object === selection) {
      out.print('<div class="json-pretty json-selected">')
    } else {
      out.print('<div class="json-pretty">')
    }
    if (Array.isArray(object)) {
      printArray(object, out, 0, selection, opts)
    } else {
      printObject(object, out, 0, selection, opts)
    }
    out.print('</div>')
    return out.toString()
  }
  return ''
}
