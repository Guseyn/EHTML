import evaluatedStringWithParams from '#ehtml/evaluatedStringWithParams.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'

const ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE_AND_TIME = [
  'data-actions-on-response',
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
  'oncopy', 'oncut', 'onpaste',

  // Form events
  'onblur', 'onchange', 'oncontextmenu', 'onfocus', 'oninput', 'oninvalid',
  'onreset', 'onsearch', 'onselect', 'onsubmit',

  // Keyboard events
  'onkeydown', 'onkeypress', 'onkeyup',

  // Mouse events
  'onclick', 'ondblclick', 'onmousedown', 'onmouseenter', 'onmouseleave',
  'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onwheel',

  // Drag & Drop events
  'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover',
  'ondragstart', 'ondrop',

  // Media events
  'onabort', 'oncanplay', 'oncanplaythrough', 'oncuechange', 'ondurationchange',
  'onemptied', 'onended', 'onerror', 'onloadeddata', 'onloadedmetadata',
  'onloadstart', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange',
  'onseeked', 'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate', 'onvolumechange',
  'onwaiting',

  // Animation & Transition events
  'onanimationcancel', 'onanimationend', 'onanimationiteration', 'onanimationstart',
  'ontransitioncancel', 'ontransitionend', 'ontransitionrun', 'ontransitionstart',

  // Window / Frame events
  'onafterprint', 'onbeforeprint', 'onbeforeunload', 'onerror', 'onhashchange',
  'onload', 'onmessage', 'onoffline', 'ononline', 'onpagehide', 'onpageshow',
  'onpopstate', 'onresize', 'onstorage', 'onunload',

  // Focus events (in addition to form ones)
  'onfocusin', 'onfocusout',

  // Touch events (mobile)
  'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart',

  // Pointer events
  'ongotpointercapture', 'onlostpointercapture', 'onpointercancel',
  'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove',
  'onpointerout', 'onpointerover', 'onpointerup',

  // Wheel / Scroll / Resize
  'onscroll', 'onwheel',

  // Print events (for completeness)
  'onbeforeprint', 'onafterprint',

  // Speech / Input composition
  'oncompositionstart', 'oncompositionupdate', 'oncompositionend',

  // Details / Toggle
  'ontoggle',

  // Progress element events
  'onprogress',

  // WebSocket / Server-sent events
  'onopen', 'onmessage', 'onclose',

  // Misc newer ones
  'onsecuritypolicyviolation', 'onvisibilitychange', 'onbeforematch', 'oncancel'
]

export default function (node, state) {
  if (node.attributes) {
    const nodeAttributes = Array.from(node.attributes)
    for (let i = 0; i < nodeAttributes.length; i++) {
      const attr = nodeAttributes[i]
      const isAttributeToBeIgnored = ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE_AND_TIME.indexOf(attr.name) >= 0 ||
        (
          attr.name === 'data-src' && TAGS_WITH_SRC_ATTRIBUTE.indexOf(node.tagName.toLowerCase()) === -1
        ) ||
        NATIVE_EVENT_LISTENERS.indexOf(attr.name) >= 0
      const isAttributeWithParams = /\$\{([^${}]+)\}/gm.test(attr.value)
      const isAttributeToBeObserved = !isAttributeToBeIgnored && isAttributeWithParams
      if (isAttributeToBeIgnored && isAttributeWithParams) {
        node.__ehtmlState__ = state
      }
      if (!isAttributeToBeObserved) {
        continue
      }
      node.setAttribute(
        attr.name,
        state
          ? evaluatedStringWithParamsFromState(attr.value, state, node)
          : evaluatedStringWithParams(attr.value, node)
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
        continue
      }
      if (node.tagName.toLowerCase() === 'input' && node.getAttribute('type') === 'checkbox' && attr.name === 'data-checked') {
        if (attr.value === 'true') {
          node.setAttribute('checked', 'checked')
        }
        node.removeAttribute('data-checked')
        continue
      }
      if (attr.name === 'data-value') {
        if (node.tagName.toLowerCase() === 'input' && node.getAttribute('type') === 'number') {
          node.value = attr.value * 1
        } else {
          node.value = attr.value
        }
        node.removeAttribute('data-value')
        continue
      }
      if ((attr.name === 'data-src') && (TAGS_WITH_SRC_ATTRIBUTE.indexOf(node.tagName.toLowerCase()) !== -1)) {
        node.setAttribute('src', node.getAttribute('data-src'))
        node.removeAttribute('data-src')
        continue
      }
      if (attr.name === 'data-inner-html') {
        node.innerHTML = attr.value
        node.removeAttribute('data-inner-html')
        continue
      }
      if (attr.name === 'disabled' && attr.value === 'false') {
        node.removeAttribute('disabled')
        continue
      }
    }
  }
}
