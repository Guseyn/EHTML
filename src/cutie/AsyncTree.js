'use strict'

const SimpleTreeNode = require('./SimpleTreeNode')
const AsyncTreeNode = require('./AsyncTreeNode')
const NotDefinedAsyncTreeNode = require('./NotDefinedAsyncTreeNode')

class AsyncTree {
  /*
    rootField: AsyncObject
  */
  constructor (rootField) {
    this.rootField = rootField
    this.nodes = []
  }

  // PUBLIC

  create () {
    this.createAsyncTreeNode(this.rootField, new NotDefinedAsyncTreeNode(), 0)
    return this
  }

  call () {
    let leaves = this.nodes.filter(node => {
      return node.isLeaf()
    })
    leaves.forEach(leaf => {
      leaf.call()
    })
  }

  // PRIVATE

  createChildNodes (field, parent) {
    field.iterateArgs((argAsField, index, isAsyncObject, isEvent) => {
      if (isAsyncObject) {
        this.createAsyncTreeNode(argAsField, parent, index)
      } else if (isEvent) {
        this.createSimpleTreeNode((...eventArgs) => {
          argAsField.body(...eventArgs)
        }, parent, index)
      } else {
        this.createSimpleTreeNode(argAsField, parent, index)
      }
    })
  }

  createAsyncTreeNode (field, parent, index) {
    let asyncTreeNode = new AsyncTreeNode(field, parent, index)
    this.nodes.push(asyncTreeNode)
    this.createChildNodes(field, asyncTreeNode)
  }

  createSimpleTreeNode (field, parent, index) {
    let treeNode = new SimpleTreeNode(field, parent, index)
    this.nodes.push(treeNode)
  }
}

module.exports = AsyncTree
