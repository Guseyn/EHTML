import elm from '#ehtml/elm.js'
import isTemplate from '#ehtml/isTemplate.js'
import isTemplateWithType from '#ehtml/isTemplateWithType.js'

export default function releaseTemplate(elmSelectorOrElm) {
  const element = elm(elmSelectorOrElm)

  if (!element || !isTemplate(element)) {
    throw new Error(
      `releaseTemplate() is called on element ${elmSelectorOrElm} which is not <template>`
    )
  }

  // Allow only:
  //   - native <template>
  //   - <template is="e-reusable">
  const templateIsNativeOrReusable =
    isTemplateWithType(element, 'e-reusable') ||
    !element.hasAttribute('is')

  if (!templateIsNativeOrReusable) {
    throw new Error(
      `releaseTemplate() works only on native <template> or <template is="e-reusable">.`
    )
  }

  // ✔ New state model:
  //   releaseTemplate just triggers the template with an *empty state patch*
  //
  //   The template (via templateTriggerEventListener)
  //   will merge this patch into the parent’s lexical state.
  //
  //   If template needs data, the user should call mapToTemplate().
  // We use queueMicrotask() to ensure this event fires *after* the current
  // synchronous DOM operations complete, so if the template is appended
  // synchronously before this call, it will already be connected.
  queueMicrotask(() => {
    element.dispatchEvent(
      new CustomEvent('ehtml:template-triggered', {
        bubbles: false,
        detail: { state: {} }
      })
    )
  })
}

window.releaseTemplate = releaseTemplate
