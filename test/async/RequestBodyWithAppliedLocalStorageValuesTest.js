require('./../../mock.js')
const RequestBodyWithAppliedLocalStorageValues = require('./../../src/async/RequestBodyWithAppliedLocalStorageValues')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

new DeepStrictEqualAssertion(
  new RequestBodyWithAppliedLocalStorageValues({ a1: '/api/user/${localStorage.userId}',
    a2: [ '/api/user/${localStorage.userId}' ],
    a3:
    [ { a: '/api/user/${localStorage.userId}' },
      { a: '/api/user/${localStorage.userId}', b: { a: '/api/user/${localStorage.userId}' } } ],
    a4: null,
    a5: undefined,
    a6: 123,
    a7: 'simple string',
    a8: { a: { a: { a: '/api/user/${localStorage.userId}' } } } }),
  { a1: '/api/user/userId',
    a2: [ '/api/user/userId' ],
    a3:
    [ { a: '/api/user/userId' },
      { a: '/api/user/userId', b: { a: '/api/user/userId' } } ],
    a4: null,
    a5: undefined,
    a6: 123,
    a7: 'simple string',
    a8: { a: { a: { a: '/api/user/userId' } } } }
).call()
