require('./../../mock.js')
const MemoryStorageWithSetValue = require('./../../src/async/MemoryStorageWithSetValue')
const MemoryStorageWithAddedItemToArray = require('./../../src/async/MemoryStorageWithAddedItemToArray')
const MemoryStorageWithRemovedItemFromArray = require('./../../src/async/MemoryStorageWithRemovedItemFromArray')
const ValueFromMemoryStorage = require('./../../src/async/ValueFromMemoryStorage')
const { DeepStrictEqualAssertion } = require('@cuties/assert')

/* eslint-disable no-undef */

new DeepStrictEqualAssertion(
  new ValueFromMemoryStorage(
    new MemoryStorageWithRemovedItemFromArray(
      new MemoryStorageWithAddedItemToArray(
        new MemoryStorageWithSetValue(memoryStorage, 'key', { values: ['value1'] }),
        'key.values', 'value2'
      ), 'key.values', 0
    ), 'key'
  ),
  { values: ['value2'] }
).call()

new DeepStrictEqualAssertion(
  new ValueFromMemoryStorage(
    new MemoryStorageWithRemovedItemFromArray(
      new MemoryStorageWithAddedItemToArray(
        new MemoryStorageWithSetValue(memoryStorage, 'values', ['value1']),
        'values', 'value2'
      ), 'values', 0
    ), 'values'
  ),
  ['value2']
).call()
