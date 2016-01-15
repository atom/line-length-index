let idCounter = 0

export default class Node {
  constructor (lineLength, left, right, priority) {
    this.lineLength = lineLength
    this.left = left
    this.right = right
    this.priority = priority
    this.id = ++idCounter
    this.parent = null

    this.computeSubtreeProperties()
  }

  computeSubtreeProperties () {
    let leftSubtreeSize = this.left ? this.left.subtreeSize : 0
    let rightSubtreeSize = this.right ? this.right.subtreeSize : 0
    this.subtreeSize = leftSubtreeSize + 1 + rightSubtreeSize

    let leftMax = this.left ? this.left.maxLineLength : -1
    let rightMax = this.right ? this.right.maxLineLength : -1
    this.maxLineLength = Math.max(leftMax, this.lineLength, rightMax)
  }

  getLeftSubtreeSize () {
    if (this.left) {
      return this.left.subtreeSize
    } else {
      return 0
    }
  }
}
