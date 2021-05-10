/**
 * Unit testing for RIVER uses Mocha for the testing framework,
 * Chai for assertions/behavior driven development, and Sinon for
 * mocks/spies/stubs (needed to test AJAX/API calls i.e. components using
 * Fetch API).
 *
 * We've outlined some skeleton code containing example hooks and tests.
 */

const Foo = require('./example.js').Foo
const should = require('chai').should()

/**
 * Use describe(..) to create new test suites
 */
describe('Example test suite', () => {
  let foo

  /**
     * before(..) runs once before all tests
     */
  before(() => {
    console.info('Running example tests')
  })

  /**
     * before(..) runs once before all tests
     */
  after(() => {
    console.info('Finished running example tests')
  })

  /**
     * beforeEach(..) runs once before each unit test
     */
  beforeEach(() => {
    foo = new Foo()
  })

  /**
     * afterEach(..) runs once after each unit test
     */
  afterEach(() => {
    foo = null
  })

  /**
     * describe(..) should also be used for new test cases
     */
  describe('Example unit test', () => {
    /**
         * it(..) should be a single case for unit tests.
         */
    it('should run case one', () => {
      foo.should.be.a('object')
    })

    /**
         * This is an example of another case for unit tests.
         */
    it('should run case two', () => {
      foo.should.have.property('arr').with.lengthOf(0)
    })
  })

  /**
     * We currently also have Sinon as a development dependency in the
     * instance where API calls are necessary. An example for this
     * will be added when this becomes necessary.
     */
})
