require('./../../mock.js')
const ElementWithAppliedValuesInTextNodes = require('./../../src/async/ElementWithAppliedValuesInTextNodes')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

new DeepStrictEqualAssertion(
  new ElementWithAppliedValuesInTextNodes(
    {
      childNodes: [
        {
          nodeType: Node.TEXT_NODE,
          nodeValue: 'Name: ${user.name}'
        },
        {
          nodeType: Node.NO_TEXT_NODE,
          childNodes: []
        },
        {
          nodeType: Node.NO_TEXT_NODE,
          childNodes: [
            {
              nodeType: Node.NO_TEXT_NODE,
              childNodes: [
                {
                  nodeType: Node.TEXT_NODE,
                  nodeValue: 'Age: ${user.age}'
                }
              ]
            },
            {
              nodeType: Node.TEXT_NODE,
              nodeValue: 'Email: ${user.email}'
            },
            {
              nodeType: Node.TEXT_NODE,
              nodeValue: 'Email: ${admin.email}'
            }
          ]
        }
      ]
    }, {
      user: {
        name: 'test name',
        age: 'test age',
        email: 'test@email'
      }
    }),
  {
    childNodes: [
      {
        nodeType: Node.TEXT_NODE,
        nodeValue: 'Name: test name'
      },
      {
        nodeType: Node.NO_TEXT_NODE,
        childNodes: []
      },
      {
        nodeType: Node.NO_TEXT_NODE,
        childNodes: [
          {
            nodeType: Node.NO_TEXT_NODE,
            childNodes: [
              {
                nodeType: Node.TEXT_NODE,
                nodeValue: 'Age: test age'
              }
            ]
          },
          {
            nodeType: Node.TEXT_NODE,
            nodeValue: 'Email: test@email'
          },
          {
            nodeType: Node.TEXT_NODE,
            nodeValue: 'Email: ${admin.email}'
          }
        ]
      }
    ]
  }
).call()
