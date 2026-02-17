/* ════════════════════════════════════════════════════════════════════════
 *  isCustomElement(el)
 * ------------------------------------------------------------------------
 *  Determines whether a given DOM element should be treated as an EHTML
 *  custom element.
 *
 *  EHTML supports two kinds of custom elements:
 *
 *    1. Autonomous custom elements
 *         Defined directly by tag name:
 *           <e-json>, <e-html> etc.
 *
 *    2. Customized built-in custom elements
 *         Defined using the "is" attribute:
 *           <template is="e-wrapper">
 *           <form is="e-form">
 *           <select is="e-select">
 *
 *  Detection rules:
 *
 *    • If 'el' is not an Element → false
 *    • If tagName exists in customElements registry → true
 *    • If "is" attribute exists and its value is registered → true
 *    • Otherwise → false
 *
 *  Notes:
 *    • This function does *not* check activation state; it only determines
 *      whether an element *represents* an EHTML custom element type.
 *    • Works reliably even on browsers that refuse to upgrade customized
 *      built-ins (notably iOS Safari).
 * ════════════════════════════════════════════════════════════════════════ */
export default function isCustomElement(el) {
  /*
   * Skip all non-element nodes (text, comments, fragments, etc.)
   */
  if (!(el instanceof Element)) {
    return false
  }

  /*
   * Autonomous custom elements:
   * Their tag name is the registered custom element type.
   */
  const tagName = el.tagName.toLowerCase()
  if (customElements.get(tagName)) {
    return true
  }

  /*
   * Customized built-in elements:
   * They declare their custom element type via the "is" attribute.
   *
   * Example:
   *   <template is="e-wrapper">
   *   <form is="e-form">
   *
   * We check whether the "is" type exists in the customElements registry.
   */
  const isAttr = el.getAttribute('is')
  if (isAttr) {
    const type = isAttr.toLowerCase()
    if (customElements.get(type)) {
      return true
    }
  }

  /*
   * No matching custom element definition was found.
   */
  return false
}
