import isTemplateWithType from '#ehtml/isTemplateWithType.js'

export default function (template, contentNode) {
  if (isTemplateWithType(template, 'e-reusable')) {
    if (template.hasAttribute('data-prepend-to')) {
      const parentNode = document.querySelector(template.getAttribute('data-prepend-to'))
      if (!parentNode) {
        throw new Error('element is not found by the selector in the attribute "data-prepend-to"')
      }
      parentNode.prepend(contentNode)
    } else if (template.hasAttribute('data-append-to')) {
      const parentNode = document.querySelector(template.getAttribute('data-append-to'))
      if (!parentNode) {
        throw new Error('element is not found by the selector in the attribute "data-append-to"')
      }
      parentNode.append(contentNode)
    } else if (template.hasAttribute('data-insert-into')) {
      const parentNode = document.querySelector(template.getAttribute('data-insert-into'))
      if (!parentNode) {
        throw new Error('element is not found by the selector in the attribute "data-insert-into"')
      }
      parentNode.innerHTML = ''
      parentNode.append(contentNode)
    } else {
      template.parentNode.insertBefore(contentNode, template)
    }
  } else {
    template.parentNode.replaceChild(contentNode, template)
  }
}
