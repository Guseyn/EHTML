import elm from '#ehtml/elm.js?v=21adcdae'
import isTemplate from '#ehtml/isTemplate.js?v=e3182ac2'
import mapToTemplate from '#ehtml/actions/mapToTemplate.js?v=41e9e9e3'

export default function releaseTemplate (elmSelectorOrElm) {
  const elmIsSelector = typeof elmSelectorOrElm === 'string'
  const template = elm(elmSelectorOrElm)
  if (template === null || template === undefined) {
    if (elmIsSelector) {
      throw new Error(`template with selector ${elmSelectorOrElm} is not found`)
    }
    throw new Error(`template in releaseTemplate() is not found`)
  }
  if (!isTemplate(template)) {
    throw new Error('releaseTemplate() handles only <template> elements')
  }
  mapToTemplate(template)
}

window.releaseTemplate = releaseTemplate
