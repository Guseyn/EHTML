const { elementWithAttribute, ObjWithNoFuncs } = require('./../../mock.js')
const ElementWithAppliedValuesToChildNodes = require('./../../src/async/ElementWithAppliedValuesToChildNodes')
const { DeepStrictEqualAssertion, StrictEqualAssertion } = require('@cuties/assert')

localStorage.setItem('localValue', 'localValue')
// eslint-disable-next-line no-undef
memoryStorage.setItem('memoryValue', 'memoryValue')

new DeepStrictEqualAssertion(
  new ObjWithNoFuncs(
    new ElementWithAppliedValuesToChildNodes(
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
          elementWithAttribute('data-text', 'User: ${user}'),
          elementWithAttribute('data-actions', 'User: ${user}')
        ]
      },
      {
        id: 123,
        name: 'test name',
        age: 'test age',
        email: 'test@email',
        account: {
          name: 'acc'
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
      },
      {
        id: 10,
        attributes: [ { name: 'data-actions', value: 'User: ${user}' } ],
        value: '',
        childNodes: [ ]
      }
    ]
  }
).call()

try {
  new ElementWithAppliedValuesToChildNodes(
    {
      getAttribute: (name) => {
        return null
      },
      childNodes: [
        elementWithAttribute('data-actions', 'User: ${user}'),
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
      id: 123,
      name: 'test name',
      age: 'test age',
      email: 'test@email',
      account: {
        name: 'acc'
      }
    }
  ).call()
} catch (err) {
  new DeepStrictEqualAssertion(
    err,
    new Error('elm #null must have attribute data-object for applying values to child nodes, so you can know what object it encapsulates')
  ).call()
}

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
