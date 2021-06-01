/**
 * Unit testing for the date converter (ensuring proper formats from UNIX timestamp)
 *
 * @author Katherine Baker <klbaker@ucsd.edu>
 */

const DateConverter = require('../src/utils/DateConverter.js')
const should = require('chai').should()

const testConverter = new DateConverter(Date.UTC('2021','03','24','22','35','30'))

// tester is the UNIX timestamp for  May 23, 2021 at 22:35:30
const testDate = new Date(Date.UTC('2021','03','24','22','35','30'))
const today = Date.now()

it("should convert days since January 1, 1970 correctly", () => {
    testConverter.getDaysFromTimeStamp(testDate).should.equal(18770)
})

it("should determine that today is not May 24", () => {
    testConverter.equal(testDate).should.be(false);
})

it("should determine today properly", () => {
    testConverter.equal(today).should.be(true);
})