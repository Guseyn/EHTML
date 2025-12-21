import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'

const ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE_AND_TIME = [
  'data-actions-on-response',
  'data-actions-on-progress-start',
  'data-actions-on-progress-end',
  'data-condition-to-display',
  'data-list-to-iterate',
  'data-item-name',
  'data-bound-to',
  'data-cache-from',
  'data-src',
  'data-request-headers',
  'data-request-url',
  'data-socket'
]

const TAGS_WITH_SRC_ATTRIBUTE = [
  'audio',
  'embed',
  'iframe',
  'img',
  'input',
  'script',
  'source',
  'track',
  'video',
  'midi-player'
]

const NATIVE_EVENT_LISTENERS = [
  // Clipboard events
  "oncopy", "oncut", "onpaste",

  // Form events
  "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "oninvalid",
  "onreset", "onsearch", "onselect", "onsubmit",

  // Keyboard events
  "onkeydown", "onkeypress", "onkeyup",

  // Mouse events
  "onclick", "ondblclick", "onmousedown", "onmouseenter", "onmouseleave",
  "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onwheel",

  // Drag & Drop events
  "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover",
  "ondragstart", "ondrop",

  // Media events
  "onabort", "oncanplay", "oncanplaythrough", "oncuechange", "ondurationchange",
  "onemptied", "onended", "onerror", "onloadeddata", "onloadedmetadata",
  "onloadstart", "onpause", "onplay", "onplaying", "onprogress", "onratechange",
  "onseeked", "onseeking", "onstalled", "onsuspend", "ontimeupdate", "onvolumechange",
  "onwaiting",

  // Animation & Transition events
  "onanimationcancel", "onanimationend", "onanimationiteration", "onanimationstart",
  "ontransitioncancel", "ontransitionend", "ontransitionrun", "ontransitionstart",

  // Window / Frame events
  "onafterprint", "onbeforeprint", "onbeforeunload", "onerror", "onhashchange",
  "onload", "onmessage", "onoffline", "ononline", "onpagehide", "onpageshow",
  "onpopstate", "onresize", "onstorage", "onunload",

  // Focus events (in addition to form ones)
  "onfocusin", "onfocusout",

  // Touch events (mobile)
  "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart",

  // Pointer events
  "ongotpointercapture", "onlostpointercapture", "onpointercancel",
  "onpointerdown", "onpointerenter", "onpointerleave", "onpointermove",
  "onpointerout", "onpointerover", "onpointerup",

  // Wheel / Scroll / Resize
  "onscroll", "onwheel",

  // Print events (for completeness)
  "onbeforeprint", "onafterprint",

  // Speech / Input composition
  "oncompositionstart", "oncompositionupdate", "oncompositionend",

  // Details / Toggle
  "ontoggle",

  // Progress element events
  "onprogress",

  // WebSocket / Server-sent events
  "onopen", "onmessage", "onclose",

  // Misc newer ones
  "onsecuritypolicyviolation", "onvisibilitychange", "onbeforematch", "oncancel"
]

const hasParams = v => v.includes('${')

export default function processAttributes(node) {
  if (!node.attributes) {
    return
  }

  const attrs = Array.from(node.attributes)
  const tag = node.tagName.toLowerCase()

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    const name = attr.name
    const rawValue = attr.value

    const ignore =
      ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE_AND_TIME.includes(name) ||
      (name === 'data-src' && !TAGS_WITH_SRC_ATTRIBUTE.includes(tag)) ||
      NATIVE_EVENT_LISTENERS.includes(name)

    if (ignore) {
      continue
    }

    // not a template expression?
    if (!hasParams(rawValue)) {
      continue
    }

    // evaluate now
    const state = getNodeScopedState(node)
    
    if (name === 'data-internal-state') {
      const evaluated = evaluatedValueWithParamsFromState(rawValue, state, node)
      node.internalState = evaluated
      node.setAttribute(
        name,
        `<{${rawValue}> is now accessible in object "internalState" inside of your web component`
      )
      continue
    }

    let evaluatedString = evaluatedStringWithParamsFromState(rawValue, state, node)

    if (typeof evaluated === 'object') {
      evaluatedString = JSON.stringify(evaluated)
    }

    // ---- attribute transformations -----

    if (name === 'data-text') {
      const textNode = document.createTextNode(evaluatedString)
      if (node.childNodes.length === 0) {
        node.appendChild(textNode)
      } else {
        node.insertBefore(textNode, node.firstChild)
      }
      node.removeAttribute(name)
      continue
    }

    if (tag === 'input' && node.getAttribute('type') === 'checkbox' && name === 'data-checked') {
      if (evaluatedString === 'true') {
        node.setAttribute('checked', 'checked')
      }
      node.removeAttribute(name)
      continue
    }

    if (name === 'data-value') {
      if (tag === 'input' && node.getAttribute('type') === 'number') {
        node.value = Number(evaluatedString)
      } else {
        node.value = evaluatedString
      }
      node.removeAttribute(name)
      continue
    }

    if (name === 'data-src' && TAGS_WITH_SRC.includes(tag)) {
      node.setAttribute('src', evaluatedString)
      node.removeAttribute('data-src')
      continue
    }

    if (name === 'data-inner-html') {
      node.innerHTML = evaluatedString
      node.removeAttribute('data-inner-html')
      continue
    }

    if (name === 'disabled' && evaluatedString === 'false') {
      node.removeAttribute('disabled')
      continue
    }

    // default: update attribute normally
    node.setAttribute(name, evaluatedString)
  }
}
