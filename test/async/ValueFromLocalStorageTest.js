require('./../../mock.js')
const LocalStorageWithSetValue = require('./../../src/async/LocalStorageWithSetValue')
const ValueFromLocalStorage = require('./../../src/async/ValueFromLocalStorage')
const { StrictEqualAssertion } = require('@cuties/assert')

new StrictEqualAssertion(
  new ValueFromLocalStorage(
    new LocalStorageWithSetValue(localStorage, 'key', 'value'), 'key'
  ),
  'value'
).call()
