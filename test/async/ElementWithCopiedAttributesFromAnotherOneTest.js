const {
  elementWithAttribute,
  ObjWithNoFuncs
} = require('./../../mock.js')
const ElementWithCopiedAttributesFromAnotherOne = require('./../../src/async/ElementWithCopiedAttributesFromAnotherOne')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

new DeepStrictEqualAssertion(
  new ObjWithNoFuncs(
    new ElementWithCopiedAttributesFromAnotherOne(
      elementWithAttribute('data-text', 'text'),
      elementWithAttribute('data-src', 'src')
    )
  ),
  {
    attrs: {
      'data-src': 'src',
      'data-text': 'text'
    },
    childNodes: [],
    id: 0,
    value: ''
  }
).call()
