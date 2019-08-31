const { elementWithAttribute, ObjWithNoFuncs } = require('./../../mock.js')
const ElementWithAppliedDataTextAndValueAttributesForChildNodes = require('./../../src/async/ElementWithAppliedDataTextAndValueAttributesForChildNodes')
const { DeepStrictEqualAssertion, StrictEqualAssertion } = require('@cuties/assert')

localStorage.setItem('localValue', 'localValue')
// eslint-disable-next-line no-undef
memoryStorage.setItem('memoryValue', 'memoryValue')

new DeepStrictEqualAssertion(
  new ObjWithNoFuncs(
    new ElementWithAppliedDataTextAndValueAttributesForChildNodes(
      {
        getAttribute: (name) => {
          return 'user'
        },
        childNodes: [
          elementWithAttribute('data-text', 'Name: ${user.name}, user account: ${user.account.name}, localValue: ${localStorage.localValue}, memoryValue: ${memoryStorage.memoryValue}'),
          elementWithAttribute('data-value', 'Name: ${user.name}, user account: ${user.account.name}'),
          elementWithAttribute(
            'data-text', 'Age: ${user.age}',
            elementWithAttribute('data-text', 'Email: ${user.email}'),
            elementWithAttribute('data-value', 'User name: ${user.name}, another user name: ${anotherUser.name}'),
            elementWithAttribute('data-value', 'Email: ${user.email}')
          ),
          elementWithAttribute('data-attr', 'value ${user.id}'),
          elementWithAttribute('data-text', 'Email: ${user.email}'),
          elementWithAttribute('data-text', 'User name: ${user.name}, another user name: ${anotherUser.name}'),
          elementWithAttribute('data-text', 'User: ${user}')
        ]
      },
      {
        user: {
          id: 123,
          name: 'test name',
          age: 'test age',
          email: 'test@email',
          account: {
            name: 'acc'
          }
        }
      }
    )
  ),
  {
    childNodes: [
      {
        id: 0,
        attributes: [ ],
        value: '',
        childNodes: [
          {
            nodeValue: 'Name: test name, user account: acc, localValue: localValue, memoryValue: memoryValue'
          }
        ]
      },
      {
        id: 1,
        attributes: [ ],
        value: 'Name: test name, user account: acc',
        childNodes: [ ]
      },
      {
        id: 5,
        attributes: [ ],
        value: '',
        childNodes:
        [
          { nodeValue: 'Age: test age' },
          {
            id: 2,
            attributes: [ ],
            value: '',
            childNodes: [
              {
                nodeValue: 'Email: test@email'
              }
            ]
          },
          {
            id: 3,
            attributes: [ { name: 'data-value', value: 'User name: test name, another user name: ${anotherUser.name}' } ],
            value: '',
            childNodes: [ ]
          },
          {
            id: 4, attributes: [], value: 'Email: test@email', childNodes: []
          }
        ]
      },
      {
        id: 6,
        attributes: [ { name: 'data-attr', value: 'value 123' } ],
        value: '',
        childNodes: [ ]
      },
      {
        id: 7,
        attributes: [ ],
        value: '',
        childNodes: [
          {
            nodeValue: 'Email: test@email'
          }
        ]
      },
      {
        id: 8,
        attributes: [ { name: 'data-text', value: 'User name: test name, another user name: ${anotherUser.name}' } ],
        value: '',
        childNodes: [ ]
      },
      {
        id: 9,
        attributes: [ ],
        value: '',
        childNodes: [
          {
            nodeValue: 'User: {"id":123,"name":"test name","age":"test age","email":"test@email","account":{"name":"acc"}}'
          }
        ]
      }
    ]
  }
).call()

new DeepStrictEqualAssertion(
  new ObjWithNoFuncs(
    new ElementWithAppliedDataTextAndValueAttributesForChildNodes(
      {
        getAttribute: (name) => {
          return null
        },
        childNodes: [
          elementWithAttribute('data-text', 'Name: ${user.name}, user account: ${user.account.name}, localValue: ${localStorage.localValue}, memoryValue: ${memoryStorage.memoryValue}'),
          elementWithAttribute('data-value', 'Name: ${user.name}, user account: ${user.account.name}'),
          elementWithAttribute(
            'data-text', 'Age: ${user.age}',
            elementWithAttribute('data-text', 'Email: ${user.email}'),
            elementWithAttribute('data-value', 'User name: ${user.name}, another user name: ${anotherUser.name}'),
            elementWithAttribute('data-value', 'Email: ${user.email}')
          ),
          elementWithAttribute('data-attr', 'value ${user.id}'),
          elementWithAttribute('data-text', 'Email: ${user.email}'),
          elementWithAttribute('data-text', 'User name: ${user.name}, another user name: ${anotherUser.name}'),
          elementWithAttribute('data-text', 'User: ${user}')
        ]
      },
      {
        user: {
          id: 123,
          name: 'test name',
          age: 'test age',
          email: 'test@email',
          account: {
            name: 'acc'
          }
        }
      }
    )
  ),
  {
    childNodes: [
      {
        id: 10,
        attributes: [ ],
        value: '',
        childNodes: [
          {
            nodeValue: 'Name: test name, user account: acc, localValue: localValue, memoryValue: memoryValue'
          }
        ]
      },
      {
        id: 11,
        attributes: [ ],
        value: 'Name: test name, user account: acc',
        childNodes: [ ]
      },
      {
        id: 15,
        attributes: [ ],
        value: '',
        childNodes:
        [
          { nodeValue: 'Age: test age' },
          {
            id: 12,
            attributes: [ ],
            value: '',
            childNodes: [
              {
                nodeValue: 'Email: test@email'
              }
            ]
          },
          {
            id: 13,
            attributes: [ { name: 'data-value', value: 'User name: test name, another user name: ${anotherUser.name}' } ],
            value: '',
            childNodes: [ ]
          },
          {
            id: 14, attributes: [], value: 'Email: test@email', childNodes: []
          }
        ]
      },
      {
        id: 16,
        attributes: [ { name: 'data-attr', value: 'value 123' } ],
        value: '',
        childNodes: [ ]
      },
      {
        id: 17,
        attributes: [ ],
        value: '',
        childNodes: [
          {
            nodeValue: 'Email: test@email'
          }
        ]
      },
      {
        id: 18,
        attributes: [ { name: 'data-text', value: 'User name: test name, another user name: ${anotherUser.name}' } ],
        value: '',
        childNodes: [ ]
      },
      {
        id: 19,
        attributes: [ ],
        value: '',
        childNodes: [
          {
            nodeValue: 'User: {"id":123,"name":"test name","age":"test age","email":"test@email","account":{"name":"acc"}}'
          }
        ]
      }
    ]
  }
).call()

new StrictEqualAssertion(
  elementWithAttribute('data-text', 'text').getAttribute('data-value'),
  undefined
).call()

new StrictEqualAssertion(
  elementWithAttribute('data-text', 'text').setAttribute('data-value', 'value'),
  undefined
).call()

new StrictEqualAssertion(
  elementWithAttribute('data-text', 'text').removeAttribute('data-value'),
  undefined
).call()
