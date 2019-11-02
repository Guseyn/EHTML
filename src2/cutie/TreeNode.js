'use strict'

/* abstract class */

class TreeNode {
  /*
    field: just some value (argument), also can be Event
    parent: AsyncTreeNode
    position: int
  */
  constructor (field, parent, position) {
    this.field = field
    this.parent = parent
    this.position = position
  }

  // TO BE OVERRIDEN

  call (result) {
    result = result || ''
    throw new Error(`call must be overridden and insert result ${result} into parent node`)
  }

  isLeaf () {
    throw new Error('isLeaf must be overridden')
  }

  // NOT ALLOWED TO BE OVERRIDDEN

  callParent (result) {
    this.parent.insertArgumentResult(this.position, result)
    if (this.parent.readyToBeInvoked()) {
      this.parent.call()
    }
  }
}

module.exports = TreeNode
