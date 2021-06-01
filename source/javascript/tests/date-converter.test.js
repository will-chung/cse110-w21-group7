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

describe ('Testing DateConverter', function() {
    let actualNow
    let testConverter

    beforeEach(function () {
        actualNow = Date.now;
        Date.now = fakeNow();
        testConverter = new DateConverter(Date.now)
     })
  
     afterEach(function () {
        Date.now = actualNow;
     })

    it("should convert days since January 1, 1970 correctly", () => {
        testConverter.getDaysFromTimeStamp(testDate).should.equal(18772)
    })
    
    it("should determine that today is not May 24", () => {
        testConverter.equals(testDate).should.equal(false);
    })
    
    it("should determine today properly", () => {
        testConverter.equals(Date.now).should.equal(true);
    })
})


/**
 * @author Katherine Baker <klbaker@ucsd.edu>
 * Helper function in order to change the value of Date.now() so that the unit
 * tests can be reused
 */
function fakeNow() {
    // mock now = 	1621834530 sec = May 23, 2021 at 22:35:30 (PDT)
    return 	1621834530000;
 }