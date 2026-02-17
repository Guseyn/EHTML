import katex from '#ehtml/third-party/katex/katex.min.js'

function findEndOfMath (delimiter, text, startIndex) {
  // Adapted from
  // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
  let index = startIndex
  let braceLevel = 0

  const delimLength = delimiter.length

  while (index < text.length) {
    const character = text[index]

    if (
      braceLevel <= 0 &&
      text.slice(index, index + delimLength) === delimiter
    ) {
      return index
    } else if (character === '\\') {
      index++
    } else if (character === '{') {
      braceLevel++
    } else if (character === '}') {
      braceLevel--
    }

    index++
  }

  return -1
}

const escapeRegex = function (string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

const amsRegex = /^\\begin{/

function splitAtDelimiters (text, delimiters) {
  let index
  const data = []

  const regexLeft = new RegExp(
    '(' + delimiters.map((x) => escapeRegex(x.left)).join('|') + ')'
  )

  while (true) {
    index = text.search(regexLeft)
    if (index === -1) break

    if (index > 0) {
      data.push({
        type: 'text',
        data: text.slice(0, index)
      })
      text = text.slice(index) // now text starts with delimiter
    }

    const i = delimiters.findIndex((delim) => text.startsWith(delim.left))
    index = findEndOfMath(delimiters[i].right, text, delimiters[i].left.length)

    if (index === -1) break

    const rawData = text.slice(0, index + delimiters[i].right.length)
    const math = amsRegex.test(rawData)
      ? rawData
      : text.slice(delimiters[i].left.length, index)

    data.push({
      type: 'math',
      data: math,
      rawData,
      display: delimiters[i].display
    })

    text = text.slice(index + delimiters[i].right.length)
  }

  if (text !== '') {
    data.push({
      type: 'text',
      data: text
    })
  }

  return data
}

/* Note: optionsCopy is mutated by this method. If it is ever exposed in the
 * API, we should copy it before mutating.
 */
function renderMathInText (text, optionsCopy) {
  const data = splitAtDelimiters(text, optionsCopy.delimiters)

  if (data.length === 1 && data[0].type === 'text') {
    return null
  }

  const fragment = document.createDocumentFragment()

  for (let i = 0; i < data.length; i++) {
    if (data[i].type === 'text') {
      fragment.appendChild(document.createTextNode(data[i].data))
    } else {
      const span = document.createElement('span')
      let math = data[i].data
      optionsCopy.displayMode = data[i].display

      try {
        if (optionsCopy.preProcess) {
          math = optionsCopy.preProcess(math)
        }
        katex.render(math, span, optionsCopy)
      } catch (e) {
        if (!(e instanceof katex.ParseError)) {
          throw e
        }
        optionsCopy.errorCallback(
          'KaTeX auto-render: Failed to parse `' + data[i].data + '` with ',
          e
        )
        fragment.appendChild(document.createTextNode(data[i].rawData))
        continue
      }

      fragment.appendChild(span)
    }
  }

  return fragment
}

function renderElem (elem, optionsCopy) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    const childNode = elem.childNodes[i]

    if (childNode.nodeType === 3) {
      // Text node
      let textContentConcat = childNode.textContent
      let sibling = childNode.nextSibling
      let nSiblings = 0

      while (sibling && sibling.nodeType === Node.TEXT_NODE) {
        textContentConcat += sibling.textContent
        sibling = sibling.nextSibling
        nSiblings++
      }

      const frag = renderMathInText(textContentConcat, optionsCopy)

      if (frag) {
        for (let j = 0; j < nSiblings; j++) {
          childNode.nextSibling.remove()
        }

        i += frag.childNodes.length - 1
        elem.replaceChild(frag, childNode)
      } else {
        i += nSiblings
      }
    } else if (childNode.nodeType === 1) {
      const className = ' ' + childNode.className + ' '
      const shouldRender =
        optionsCopy.ignoredTags.indexOf(
          childNode.nodeName.toLowerCase()
        ) === -1 &&
        optionsCopy.ignoredClasses.every(
          x => className.indexOf(' ' + x + ' ') === -1
        )

      if (shouldRender) {
        renderElem(childNode, optionsCopy)
      }
    }
  }
}

function renderMathInElement (elem, options) {
  if (!elem) {
    throw new Error('No element provided to render')
  }

  const optionsCopy = {}

  for (const option in options) {
    if (Object.prototype.hasOwnProperty.call(options, option)) {
      optionsCopy[option] = options[option]
    }
  }

  optionsCopy.delimiters = optionsCopy.delimiters || [
    { left: '$$', right: '$$', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\begin{equation}', right: '\\end{equation}', display: true },
    { left: '\\begin{align}', right: '\\end{align}', display: true },
    { left: '\\begin{alignat}', right: '\\end{alignat}', display: true },
    { left: '\\begin{gather}', right: '\\end{gather}', display: true },
    { left: '\\begin{CD}', right: '\\end{CD}', display: true },
    { left: '\\[', right: '\\]', display: true }
  ]

  optionsCopy.ignoredTags = optionsCopy.ignoredTags || [
    'script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'
  ]

  optionsCopy.ignoredClasses = optionsCopy.ignoredClasses || []
  optionsCopy.errorCallback = optionsCopy.errorCallback || console.error
  optionsCopy.macros = optionsCopy.macros || {}

  renderElem(elem, optionsCopy)
}

export default renderMathInElement
