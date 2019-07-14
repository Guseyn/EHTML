const {
  elementWithAttribute,
  ObjWithNoFuncs
} = require('./../../mock.js')
const AppliedDataTextAndValueAttributesForChildNodes = require('./../../src/async/AppliedDataTextAndValueAttributesForChildNodes')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

new DeepStrictEqualAssertion(
  new ObjWithNoFuncs(
    new AppliedDataTextAndValueAttributesForChildNodes(
      {
        childNodes: [
          elementWithAttribute('data-text', 'Name: ${user.name}, another name: ${anotherUser.name}'),
          elementWithAttribute('data-value', 'Name: ${user.name}, another name: ${anotherUser.name}'),
          elementWithAttribute(
            'data-text', 'Age: ${user.age}',
            elementWithAttribute('data-text', 'Email: ${user.email}'),
            elementWithAttribute('data-value', 'Email: ${user.email}')
          ),
          elementWithAttribute('data-attr', 'value'),
          elementWithAttribute('data-text', 'Email: ${admin.email}')
        ]
      }, {
        user: {
          name: 'test name',
          age: 'test age',
          email: 'test@email'
        }
      })
  ),
  {
    childNodes: [
      {
        id: 0,
        attrs: { 'data-text': 'Name: test name, another name: ${anotherUser.name}' },
        value: '',
        childNodes: []
      },
      {
        id: 1,
        attrs: { 'data-value': 'Name: test name, another name: ${anotherUser.name}' },
        value: '',
        childNodes: []
      },
      {
        id: 4,
        attrs: {},
        value: '',
        childNodes:
        [
          { nodeValue: 'Age: test age' },
          {
            id: 2,
            attrs: {},
            value: '',
            childNodes: [ { nodeValue: 'Email: test@email' } ]
          },
          {
            id: 3, attrs: {}, value: 'Email: test@email', childNodes: []
          }
        ]
      },
      {
        id: 5,
        attrs: {
          'data-attr': 'value'
        },
        value: '',
        childNodes: []
      },
      {
        id: 6,
        attrs: {},
        value: '',
        childNodes: [ { nodeValue: 'Email: ${admin.email}' } ]
      }
    ]
  }
).call()
