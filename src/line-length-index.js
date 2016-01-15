import Random from 'random-seed'
import Iterator from './iterator'
import Node from './node'

export default class LineLengthIndex {
  constructor (seed = Date.now()) {
    this.randomGenerator = new Random(seed)
    this.root = null
    this.iterator = this.buildIterator()
  }

  buildIterator () {
    return new Iterator(this)
  }

  splice (start, oldExtent, newLineLengths) {
    let startNode = this.iterator.findNode(start - 1)
    let endNode = this.iterator.findNode(start + oldExtent)

    if (startNode) {
      startNode.priority = -1
      this.bubbleNodeUp(startNode)
    }

    if (endNode) {
      endNode.priority = -2
      this.bubbleNodeUp(endNode)
    }

    let newLineLengthsSubtree = this.treeFromLineLengths(newLineLengths)
    if (startNode) {
      startNode.right = newLineLengthsSubtree
      if (newLineLengthsSubtree) newLineLengthsSubtree.parent = startNode
      startNode.computeSubtreeProperties()
    } else if (endNode) {
      endNode.left = newLineLengthsSubtree
      if (newLineLengthsSubtree) newLineLengthsSubtree.parent = endNode
    } else {
      this.root = newLineLengthsSubtree
    }

    if (endNode) endNode.computeSubtreeProperties()

    if (startNode) {
      startNode.priority = this.generateRandom()
      this.bubbleNodeDown(startNode)
    }

    if (endNode) {
      endNode.priority = this.generateRandom()
      this.bubbleNodeDown(endNode)
    }
  }

  getPointWithMaxLineLength () {
    return this.iterator.getPointWithMaxLineLength()
  }

  bubbleNodeUp (node) {
    while (node.parent && node.priority < node.parent.priority) {
      if (node === node.parent.left) {
        this.rotateNodeRight(node)
      } else {
        this.rotateNodeLeft(node)
      }
    }
  }

  bubbleNodeDown (node) {
    while (true) {
      let leftChildPriority = node.left ? node.left.priority : Infinity
      let rightChildPriority = node.right ? node.right.priority : Infinity

      if (leftChildPriority < rightChildPriority && leftChildPriority < node.priority) {
        this.rotateNodeRight(node.left)
      } else if (rightChildPriority < node.priority) {
        this.rotateNodeLeft(node.right)
      } else {
        break
      }
    }
  }

  rotateNodeLeft (pivot) {
    let root = pivot.parent

    if (root.parent) {
      if (root === root.parent.left) {
        root.parent.left = pivot
      } else {
        root.parent.right = pivot
      }
    } else {
      this.root = pivot
    }
    pivot.parent = root.parent

    root.right = pivot.left
    if (root.right) {
      root.right.parent = root
    }

    pivot.left = root
    pivot.left.parent = pivot

    root.computeSubtreeProperties()
    pivot.computeSubtreeProperties()
  }

  rotateNodeRight (pivot) {
    let root = pivot.parent

    if (root.parent) {
      if (root === root.parent.left) {
        root.parent.left = pivot
      } else {
        root.parent.right = pivot
      }
    } else {
      this.root = pivot
    }
    pivot.parent = root.parent

    root.left = pivot.right
    if (root.left) {
      root.left.parent = root
    }

    pivot.right = root
    pivot.right.parent = pivot

    root.computeSubtreeProperties()
    pivot.computeSubtreeProperties()
  }

  treeFromLineLengths (lineLengths, start = 0, end = lineLengths.length, parentPriority = 0) {
    if (start === end) return

    let priority = this.generateRandom(parentPriority)
    let row = Math.floor((start + end) / 2)
    let left = this.treeFromLineLengths(lineLengths, start, row, priority)
    let right = this.treeFromLineLengths(lineLengths, row + 1, end, priority)
    let node = new Node(lineLengths[row], left, right, priority)
    if (left) left.parent = node
    if (right) right.parent = node

    return node
  }

  generateRandom (floor = 0) {
    return this.randomGenerator.floatBetween(floor, 1)
  }
}
