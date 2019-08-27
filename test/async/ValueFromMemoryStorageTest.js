require('./../../mock.js')
const MemoryStorageWithSetValue = require('./../../src/async/MemoryStorageWithSetValue')
const ValueFromMemoryStorage = require('./../../src/async/ValueFromMemoryStorage')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

/* eslint-disable no-undef */

new DeepStrictEqualAssertion(
  new ValueFromMemoryStorage(
    new MemoryStorageWithSetValue(memoryStorage, 'key', { value: 'value' }), 'key'
  ),
  { value: 'value' }
).call()

new DeepStrictEqualAssertion(
  new ValueFromMemoryStorage(
    new MemoryStorageWithSetValue(
      new MemoryStorageWithSetValue(memoryStorage, 'key', { value: 'value' }), 'key.value', 'value'
    ), 'key.value'
  ),
  'value'
).call()

new DeepStrictEqualAssertion(
  new ValueFromMemoryStorage(
    new MemoryStorageWithSetValue(memoryStorage, 'key', { value: 'value' }), 'bad_key'
  ),
  null
).call()

new DeepStrictEqualAssertion(
  new ValueFromMemoryStorage(
    new MemoryStorageWithSetValue(
      new MemoryStorageWithSetValue(memoryStorage, 'key', { value: 'value' }), 'key.value', 'value'
    ), 'key.bad_value'
  ),
  null
).call()
