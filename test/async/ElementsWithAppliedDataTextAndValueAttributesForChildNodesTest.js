const { elementWithAttribute, ObjWithNoFuncs } = require('./../../mock.js')
const ElementsWithAppliedDataTextAndValueAttributesForChildNodes = require('./../../src/async/ElementsWithAppliedDataTextAndValueAttributesForChildNodes')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

localStorage.setItem('localValue', 'localValue')
// eslint-disable-next-line no-undef
memoryStorage.setItem('memoryValue', 'memoryValue')

new DeepStrictEqualAssertion(
  new ObjWithNoFuncs(
    new ElementsWithAppliedDataTextAndValueAttributesForChildNodes(
      {
        user: {
          name: 'test name',
          age: 'test age',
          email: 'test@email',
          account: {
            name: 'acc'
          }
        }
      },
      {
        childNodes: [
          elementWithAttribute('data-text', 'Name: ${user.name}, user account: ${user.account.name}, localValue: ${localStorage.localValue}, memoryValue: ${memoryStorage.memoryValue}'),
          elementWithAttribute('data-value', 'Name: ${user.name}, user account: ${user.account.name}'),
          elementWithAttribute(
            'data-text', 'Age: ${user.age}',
            elementWithAttribute('data-text', 'Email: ${user.email}'),
            elementWithAttribute('data-value', 'User name: ${user.name}, another user name: ${anotherUser.name}'),
            elementWithAttribute('data-value', 'Email: ${user.email}')
          ),
          elementWithAttribute('data-attr', 'value'),
          elementWithAttribute('data-text', 'Email: ${user.email}'),
          elementWithAttribute('data-text', 'User name: ${user.name}, another user name: ${anotherUser.name}')
        ]
      }
    )
  ),
  [{
    childNodes: [
      {
        id: 0,
        attrs: { },
        value: '',
        childNodes: [
          {
            nodeValue: 'Name: test name, user account: acc, localValue: localValue, memoryValue: memoryValue'
          }
        ]
      },
      {
        id: 1,
        attrs: { },
        value: 'Name: test name, user account: acc',
        childNodes: []
      },
      {
        id: 5,
        attrs: {},
        value: '',
        childNodes:
        [
          { nodeValue: 'Age: test age' },
          {
            id: 2,
            attrs: {},
            value: '',
            childNodes: [
              {
                nodeValue: 'Email: test@email'
              }
            ]
          },
          {
            id: 3,
            attrs: {
              'data-value': 'User name: test name, another user name: ${anotherUser.name}'
            },
            value: '',
            childNodes: [ ]
          },
          {
            id: 4, attrs: {}, value: 'Email: test@email', childNodes: []
          }
        ]
      },
      {
        id: 6,
        attrs: {
          'data-attr': 'value'
        },
        value: '',
        childNodes: []
      },
      {
        id: 7,
        attrs: {},
        value: '',
        childNodes: [
          {
            nodeValue: 'Email: test@email'
          }
        ]
      },
      {
        id: 8,
        attrs: {
          'data-text': 'User name: test name, another user name: ${anotherUser.name}'
        },
        value: '',
        childNodes: [ ]
      }
    ]
  }]
).call()
