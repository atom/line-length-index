import Random from 'random-seed'
import LineLengthIndex from '../src/line-length-index'

describe('LineLengthIndex', () => {
  it('determines the maximal point correctly after randomized splices', function () {
    this.timeout(Infinity)

    for (let i = 0; i < 1000; i++) {
      let seed = Date.now()
      let random = new Random(seed)
      let lineLengthsIndex = new LineLengthIndex(seed)

      let referenceLineLengths = generateRandomLineLengths(random, 10)
      lineLengthsIndex.splice(0, 0, referenceLineLengths)

      for (let j = 0; j < 300; j++) {
        let start = random(referenceLineLengths.length)
        let replacedExtent = random(referenceLineLengths.length - start)
        let replacementLineLengths = generateRandomLineLengths(random, 10)

        referenceLineLengths.splice(start, replacedExtent, ...replacementLineLengths)
        lineLengthsIndex.splice(start, replacedExtent, replacementLineLengths)

        verifyLineLengthIndex(lineLengthsIndex, referenceLineLengths, `Seed: ${seed}`)
      }
    }
  })
})

function verifyLineLengthIndex (lineLengthsIndex, referenceLineLengths) {
  let maxLineLength = -1
  let rowsWithMaxLineLength = new Set
  for (let row = 0; row < referenceLineLengths.length; row++) {
    let lineLength = referenceLineLengths[row]
    if (lineLength > maxLineLength) {
      maxLineLength = lineLength
      rowsWithMaxLineLength.clear()
    }
    if (lineLength >= maxLineLength) {
      rowsWithMaxLineLength.add(row)
    }
  }

  let maximalPoint = lineLengthsIndex.getPointWithMaxLineLength()
  if (maximalPoint) {
    assert.equal(maximalPoint.column, maxLineLength)
    assert(rowsWithMaxLineLength.has(maximalPoint.row))
  } else {
    assert.equal(referenceLineLengths.length, 0)
  }
}

function generateRandomLineLengths (random, maxLines) {
  let lineCount = random(maxLines)
  let lineLengths = []
  for (let i = 0; i < lineCount; i++) {
    lineLengths.push(random(100))
  }
  return lineLengths
}
