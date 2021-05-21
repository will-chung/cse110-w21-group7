/**
 * Data massaging layer to help with convering
 * UNIX timestamps to relevant formats.
 * @author Thanh Tong <ttong@ucsd.edu>, Noah Teshima <nteshima@ucsd.edu>
 */
class DateConverter extends Date {
    /**
     * Constructor to create a DateConverter object
     * relative to the given timestamp
     * @param {Number} timestamp Number containing the UNIX timestamp for
     * formatting 
     */
    constructor(timestamp = Date.now()) {
        super(timestamp)
        this._timestamp = timestamp
    }

    /**
     * Getter for the UNIX timestamp used for formatting
     * @returns {Number} Number containing the UNIX timestamp used for
     * formatting 
     */
    get timestamp() {
        return this._timestamp
    }

    /**
     * Setter for the UNIX timestamp to use for formatting
     * @param {Number} timestamp Number containing the UNIX timestamp for
     * formatting 
     */
    set timestamp(timestamp) {
        this._timestamp = timestamp
    }

    /**
     * Converts a UNIX timestamp to the number of days since
     * January 1, 1970
     * @returns {Number} Number of days since January 1, 1970 given
     * by the UNIX timestamp
     */
    getDaysFromTimeStamp() {
        // Number of days since January 1, 1970
        const days = Math.floor(this._timestamp / (24*60*60*1000))  
        return days
    }
}



export {DateConverter as DateConverter}