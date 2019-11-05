'use strict'

const AsyncTree = require('./AsyncTree')

/* abstract class */

class AsyncObject {
  /*
    args: any type (including AsyncObject)
  */
  constructor (...args) {
    this.args = args
    this.cache = {}
    this.next = undefined
    this.asKey = undefined
  }

  // TO BE OVERRIDDEN

  asyncCall () {
    throw new Error('asyncCall or syncCall must be defined')
  }

  syncCall () {
    throw new Error('asyncCall or syncCall must be defined')
  }

  onError (error) {
    throw error
  }

  onResult (result) {
    return result
  }

  /*
    Works only if this.continueAfterFail returns true
      (in that case this.onError and this.onResult will be ignored),
  */
  onErrorAndResult (error, result) {
    return error || result
  }

  /*
    If it returns true, then this.onError and this.onResult will be ignored,
    and the represented result of this object
    will be returned by this.onErrorAndResult.
  */
  continueAfterFail () {
    return false
  }

  callbackWithError () {
    return true
  }

  // PUBLIC API

  call () {
    this.propagateCache(this)
    new AsyncTree(this).create().call()
  }

  after (asyncObject) {
    this.next = asyncObject
    return this
  }

  as (key) {
    this.asKey = key
    return this
  }

  // NOT ALLOWED TO BE OVERRIDDEN

  iterateArgs (func) {
    this.args.forEach((arg, index) => {
      func(arg, index, this.isAsyncObject(arg), this.isEvent(arg))
    })
  }

  hasNoArgs () {
    return this.args.length === 0
  }

  readyToBeInvoked (readyResultsNum) {
    return this.args.length === readyResultsNum
  }

  callNextTreeIfExists () {
    if (this.next) {
      this.propagateCache(this.next)
      new AsyncTree(this.next).create().call()
    }
  }

  propagateCache (arg) {
    if (this.isAsyncObject(arg)) {
      arg.withCache(this.cache)
      arg.iterateArgs(arg => this.propagateCache(arg))
    }
  }

  withCache (cache) {
    this.cache = cache
    return this
  }

  saveValueIntoCacheIfNeeded (value) {
    if (this.asKey) {
      this.cache[this.asKey] = value
    }
    return this
  }

  isAsyncObject (arg) {
    return this.classChain(arg).indexOf('AsyncObject') !== -1
  }

  isEvent (arg) {
    return this.classChain(arg).indexOf('Event') !== -1
  }

  classChain (obj, chain) {
    if (!chain) {
      chain = []
    }
    if (typeof obj === 'function') {
      if (!obj.name || obj === Object) {
        return chain
      }
      return this.classChain(Object.getPrototypeOf(obj), chain.concat(obj.name))
    }
    if (typeof obj === 'object' && obj !== null) {
      return this.classChain(obj.constructor, chain)
    }
    return chain
  }
}

module.exports = AsyncObject
