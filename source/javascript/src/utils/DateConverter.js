/**
 * Data massaging layer to help with convering
 * UNIX timestamps to relevant formats.
 * @author Thanh Tong <ttong@ucsd.edu>, Noah Teshima <nteshima@ucsd.edu>, Zhiyuan Zhang <zhz018@ucsd.edu>
 */
class DateConverter extends Date {
  /**
     * Constructor to create a DateConverter object
     * relative to the given timestamp
     * @param {Number} timestamp Number containing the UNIX timestamp for
     * formatting
     */
  constructor (timestamp = Date.now()) {
    super(timestamp)
    this._timestamp = timestamp
  }

  /**
     * Getter for the UNIX timestamp used for formatting
     * @returns {Number} Number containing the UNIX timestamp used for
     * formatting
     */
  get timestamp () {
    return this._timestamp
  }

  /**
     * Setter for the UNIX timestamp to use for formatting
     * @param {Number} timestamp Number containing the UNIX timestamp for
     * formatting
     */
  set timestamp (timestamp) {
    this._timestamp = timestamp
  }

  /**
     * Converts a UNIX timestamp to the number of days since
     * January 1, 1970
     * @returns {Number} Number of days since January 1, 1970 given
     * by the UNIX timestamp
     */
  getDaysFromTimeStamp (timestamp = this._timestamp) {
    // Number of days since January 1, 1970
    const days = Math.floor(this._timestamp / (24 * 60 * 60 * 1000))
    return days
  }

  /**
   * Determines whether the given UNIX timestamp meets the following criteria:
   * 1. The day of the week corresponding to this timestamp is at or before
   * the day of the week for the timestamp inside this DateConverter object
   * 2. The date of the corresponding timestamp is within seven days of the
   * timestamp inside this dateconverter object.
   *
   * @param {Number} timestamp UNIX timestamp for comparison
   * @returns {Boolean} Whether the given UNIX timestamp is within the same week
   * as the current date.
   *
   **/
  timestampsInSameWeek (timestamp) {
    // compare to this._timestamp
    // get the days correspond to _timestamp
    const that = this
    const timestampDateConverter = new DateConverter(timestamp)
    if (Math.abs(timestampDateConverter.getDaysFromTimeStamp(timestamp) - that.getDaysFromTimeStamp()) < 7) {
      if (((that.getDay() - 1) % 7) - ((timestampDateConverter.getDay() - 1) % 7) >= 0) {
        return true
      }
    }
    return false
  }

  /**
     * Checks if the given UNIX timestamp is correct up to the
     * number of days.
     * @param {Number} timestamp UNIX timestamp to check for
     * equality to the number of days
     */
  equals (timestamp) {
    return (this.getDaysFromTimeStamp() === this.getDaysFromTimeStamp(timestamp))
  }
}

export { DateConverter }
