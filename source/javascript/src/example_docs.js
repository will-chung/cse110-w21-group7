/* eslint-disable no-unused-vars */
/**
 * This is example documentation using JSDoc. More information
 * can be found [link text]{@link https://jsdoc.app/}
 * @public
 * @class
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class Bar {
  /**
     * Example documentation for a constructor.
     * @constructor
     * @param {object} a Public object inside of Bar doing something important.
     */
  constructor (a) {
    this.a = a
  }

  /**
     * Example documentation for some function.
     * @public
     * @param {number} param1 Of type 'number'. Does something important
     * @param {string} param2 Another important parameter. Notice how we can change
     * the associated data type by changing the argument presented to param for JSDocs.
     * @param  {...any} args Rest parameters doing important stuff.
     */
  someFunction (param1, param2, ...args) {

  }

  /**
     * Example documentation for a getter
     * @public
     * @returns {object} current value for 'a'.
     */
  get a () {
    return this.a
  }

  /**
     * Example documentation for a setter
     * @public
     * @todo Write this function later
     * @throws Error (in place of implementation)
     */
  set a (a1) {
    throw new Error()
  }
}
