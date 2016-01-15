export default class Iterator {
  constructor (tree) {
    this.tree = tree
  }

  reset () {
    this.leftAncestor = null
    this.leftAncestorRow = -1
    this.leftAncestorStack = [null]
    this.leftAncestorRowStack = [-1]
    this.currentRow = -1
    this.setCurrentNode(this.tree.root)
  }

  findNode (row) {
    this.reset()

    if (!this.currentNode) return null

    while (true) {
      if (row < this.currentRow) {
        if (this.currentNode.left) {
          this.descendLeft()
        } else {
          return null
        }
      } else if (row === this.currentRow) {
        return this.currentNode
      } else { // row > this.currentRow
        if (this.currentNode.right) {
          this.descendRight()
        } else {
          return null
        }
      }
    }
  }

  getPointWithMaxLineLength () {
    this.reset()

    if (!this.currentNode) return null

    let maxLineLength = this.currentNode.maxLineLength
    while (true) {
      if (this.currentNode.lineLength === maxLineLength) {
        return {row: this.currentRow, column: maxLineLength}
      } else if (this.currentNode.left && this.currentNode.left.maxLineLength === maxLineLength) {
        this.descendLeft()
      } else {
        this.descendRight()
      }
    }
  }

  setCurrentNode (node) {
    this.currentNode = node
    if (this.currentNode) {
      this.currentRow = this.leftAncestorRow + this.currentNode.getLeftSubtreeSize() + 1
    }
  }

  descendLeft () {
    this.pushToAncestorStacks()
    this.setCurrentNode(this.currentNode.left)
  }

  descendRight () {
    this.pushToAncestorStacks()
    this.leftAncestor = this.currentNode
    this.leftAncestorRow = this.currentRow
    this.setCurrentNode(this.currentNode.right)
  }

  pushToAncestorStacks () {
    this.leftAncestorStack.push(this.leftAncestor)
    this.leftAncestorRowStack.push(this.leftAncestorRow)
  }
}
