require('./../../mock.js')
const AttributeWithAppliedLocalStorageVariables = require('./../../src/async/AttributeWithAppliedLocalStorageVariables')
const { StrictEqualAssertion } = require('@cuties/assert')

localStorage.setItem('userId', 'userId')

new StrictEqualAssertion(
  new AttributeWithAppliedLocalStorageVariables('/api/user/${localStorage.userId}'),
  '/api/user/userId'
).call()

new StrictEqualAssertion(
  new AttributeWithAppliedLocalStorageVariables(null),
  ''
).call()
