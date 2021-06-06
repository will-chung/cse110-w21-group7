/**
 * Unit testing for the date converter (ensuring proper formats from UNIX timestamp)
 *
 * @author Katherine Baker <klbaker@ucsd.edu>
 */

// const DateConverter = require('../src/utils/DateConverter.js')
import { DateConverter } from '../src/utils/DateConverter.js'
const should = require('chai').should()

// tester is the UNIX timestamp for  May 24, 2021 at 22:35:30 (PDT)
const testDate = new Date('May 24, 2021 22:35:30').getTime()

describe('Testing DateConverter', function () {
  let actualNow
  let testConverter
  let wedConverter

  beforeEach(function () {
    actualNow = Date.now
    Date.now = fakeNow()
    testConverter = new DateConverter(Date.now)

    // DateConverter for May 26, 2021
    wedConverter = new DateConverter(1622012400000)
  })

  afterEach(function () {
    Date.now = actualNow
  })

  it('getDaysFromTimeStamp should get days since January 1, 1970', () => {
    testConverter.getDaysFromTimeStamp(testDate).should.equal(18772)
  })

  describe('testing equals', () => {
    it('Equals should determine that today is not May 24', () => {
      testConverter.equals(testDate).should.equal(false)
    })

    it('Equals should work when the unix timestamp is correct', () => {
      testConverter.equals(Date.now).should.equal(true)
    })
  })

  it('getBeginningOfWeek gets the correct timestamp', () => {
    testConverter.getBeginningOfWeek().should.equal(1621316130000)
    wedConverter.getBeginningOfWeek().should.equal(1621839600000)
  })

  describe('testing timestampsInSameWeek', function () {
    it('May 16 is not in the same week as and before May 23', () => {
      const may16 = new Date('May 16, 2021 22:35:30').getTime()
      testConverter.timestampsInSameWeek(may16).should.equal(false)
    })

    it('May 17 is in the same week as and before May 23', () => {
      const may17 = new Date('May 17, 2021 22:35:30').getTime()
      testConverter.timestampsInSameWeek(may17).should.equal(true)
    })

    it('May 22 is in the same week as and before May 23', () => {
      const may22 = new Date('May 22, 2021 22:35:30').getTime()
      testConverter.timestampsInSameWeek(may22).should.equal(true)
    })

    it("This works when today isn't Sunday", () => {
      const may24 = new Date('May 24, 2021 22:35:30').getTime()

      wedConverter.timestampsInSameWeek(may24).should.equal(true)
    })
  })

  describe('testing oldTimestampInSameWeek', function () {
    it('May 16 is not in the same week as May 23', () => {
      const may16 = new Date('May 16, 2021 22:35:30').getTime()
      testConverter.oldTimestampInSameWeek(may16).should.equal(false)
    })

    it('May 17 is in the same week as May 23', () => {
      const may17 = new Date('May 17, 2021 22:35:30').getTime()
      testConverter.oldTimestampInSameWeek(may17).should.equal(true)
    })

    it('May 22 is in the same week as May 23', () => {
      const may22 = new Date('May 22, 2021 22:35:30').getTime()
      testConverter.oldTimestampInSameWeek(may22).should.equal(true)
    })

    it('May 23 is not in the same week as May 26', () => {
      const may23 = new Date('May 23, 2021 15:35:30').getTime()

      wedConverter.oldTimestampInSameWeek(may23).should.equal(false)
    })
  })
})

// TODO: add tests for all new methods

/**
 * @author Katherine Baker <klbaker@ucsd.edu>
 * Helper function in order to change the value of Date.now() so that the unit
 * tests can be reused
 */
function fakeNow () {
  return 1621834530000
}
