import elm from '#ehtml/elm.js'
import isTemplate from '#ehtml/isTemplate.js'
import isTemplateWithType from '#ehtml/isTemplateWithType.js'

export default function mapToTemplate(elmSelectorOrElm, obj) {
  const templateElm = elm(elmSelectorOrElm)

  if (!templateElm) {
    throw new Error(`mapToTemplate(): element "${elmSelectorOrElm}" not found.`)
  }

  if (!isTemplate(templateElm)) {
    throw new Error(`mapToTemplate(): target must be <template>.`)
  }

  // Allow:
  //   - native <template>
  //   - <template is="e-reusable">
  //   - <template is="e-json-map">
  const templateIsNativeOrReusable =
    isTemplateWithType(templateElm, 'e-reusable') ||
    isTemplateWithType(templateElm, 'e-json-map') ||
    !templateElm.hasAttribute('is')

  if (!templateIsNativeOrReusable) {
    throw new Error(
      `mapToTemplate() works only on native <template>, <template is="e-reusable"> or <template is="e-json-map">.`
    )
  }

  const objName = templateElm.getAttribute('data-object-name')
  if (!objName && obj) {
    throw new Error(`Mapping template must have data-object-name="…".`)
  }

  const statePatch = {}
  if (obj) {
    statePatch[objName] = obj
  }

  templateElm.dispatchEvent(
    new CustomEvent('ehtml:template-triggered', {
      bubbles: false,
      detail: { state: statePatch }
    })
  ) 
}

window.mapToTemplate = mapToTemplate
