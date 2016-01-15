import LineLengthIndex from '../../src/line-length-index'
import Node from '../../src/node'

LineLengthIndex.prototype.toHTML = function () {
  if (this.root) {
    return this.root.toHTML()
  } else {
    return ''
  }
}

Node.prototype.toHTML = function (leftAncestorRow = -1) {
  let s = '<style>'
  s += 'table { width: 100%; }'
  s += 'td { width: 50%; text-align: center; border: 1px solid gray; white-space: nowrap; }'
  s += '</style>'

  s += '<table>'

  s += '<tr>'
  let row = leftAncestorRow + this.getLeftSubtreeSize() + 1
  s += '<td colspan="2"> Row:' + row + '(Subtree Size : ' + this.subtreeSize + '), MaxLineLength: ' + this.maxLineLength + ', LineLength: ' + this.lineLength + ', / [' + this.id + '] (Priority: ' + this.priority + ') </td>'
  s += '</tr>'

  if (this.left || this.right) {
    s += '<tr>'
    s += '<td>'
    if (this.left) {
      s += this.left.toHTML(leftAncestorRow)
    } else {
      s += '&nbsp;'
    }
    s += '</td>'
    s += '<td>'
    if (this.right) {
      s += this.right.toHTML(row)
    } else {
      s += '&nbsp;'
    }
    s += '</td>'
    s += '</tr>'
  }

  s += '</table>'

  return s
}
