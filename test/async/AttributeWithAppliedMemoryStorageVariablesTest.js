require('./../../mock.js')
const AttributeWithAppliedMemoryStorageVariables = require('./../../src/async/AttributeWithAppliedMemoryStorageVariables')
const { StrictEqualAssertion } = require('@cuties/assert')

// eslint-disable-next-line no-undef
memoryStorage.setItem('user', { id: 'userId' })
// eslint-disable-next-line no-undef
memoryStorage.setItem('userId', 'userId')

new StrictEqualAssertion(
  new AttributeWithAppliedMemoryStorageVariables('/api/user/${memoryStorage.user.id}'),
  '/api/user/userId'
).call()

new StrictEqualAssertion(
  new AttributeWithAppliedMemoryStorageVariables('/api/user/${memoryStorage.userId}'),
  '/api/user/userId'
).call()

// eslint-disable-next-line no-undef
memoryStorage.setItem('user.id', 'id')

new StrictEqualAssertion(
  new AttributeWithAppliedMemoryStorageVariables('/api/user/${memoryStorage.user.id}'),
  '/api/user/id'
).call()

new StrictEqualAssertion(
  new AttributeWithAppliedMemoryStorageVariables(null),
  ''
).call()
