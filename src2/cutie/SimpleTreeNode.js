'use strict'

const TreeNode = require('./TreeNode')

class SimpleTreeNode extends TreeNode {
  /*
    field: simple argument (not AsyncObject, can be Event)
    parent: AsyncTreeNode or NotDefinedAsyncTree
    position: int
  */
  constructor (field, parent, position) {
    super(field, parent, position)
  }

  // PUBLIC

  call () {
    super.callParent(this.field)
  }

  isLeaf () {
    return true
  }
}

module.exports = SimpleTreeNode
