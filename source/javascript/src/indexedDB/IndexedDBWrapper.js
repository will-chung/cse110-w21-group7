/**
 * Wrapper class containing the relevant operations used
 * across different pages for the bullet journal. Examples of
 * this include opening a transaction for a specific daily log,
 * updating the timestamp of the daily log that should be
 * opened, and error handling subroutines (i.e. when a transaction
 * to search for an entry yields nothing).
 *
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class IndexedDBWrapper {
  /**
     * Initialize our wrapper with the specified
     * name and version for indexedDB
     * @param {String} dbName Contains the name of the
     * indexedDB database being used
     * @param {Number} version Specifies the version number
     * corresponding with the given database.
     */
  constructor (dbName, version) {
    this._dbName = dbName
    this._version = version
    this._EMPTY_SCHEMA = '/source/models/schema_empty.json'
    this._MOCK_LOG = '/source/models/schema.json'
    console.log('initialized indexedDBWrapper')
  }

  /**
     * Getter for the current database name
     * @returns {String} The name of the
     * indexedDB database being used
     */
  get dbName () {
    return this._dbName
  }

  /**
     * Setter for the current database name
     * @param {String} dbName Contains the name of the
     * indexedDB database to used
     */
  set dbName (dbName) {
    this._dbName = dbName
  }

  /**
     * Getter for the version number corresponding
     * with the given database.
     * @returns {Number} Version number
     * corresponding with the given database.
     */
  get version () {
    return this._version
  }

  /**
     * Setter for the version number being used.
     * @param {Number} version Specifies the version number
     * corresponding with the given database.
     */
  set version (version) {
    this._version = version
  }

  /**
     * Default callback for version change event handler.
     * For simple read/write transactions, this should not
     * be changed.
     * @param {IDBVersionChangeEvent} event Handler for
     * the onupgradeneeded event.
     */
  init (event) {
    // Save the IDBDatabase interface
    const db = event.target.result
    // Create an objectStore for this database
    if (!db.objectStoreNames.contains('currentLogStore')) {
      const objectStore = db.createObjectStore('currentLogStore', { autoIncrement: true })
    } else {
      console.log('currentLogStore already created!')
    }
  }

  /**
   * Default event handler for onsuccess callback
   * for IDBOpenDBRequest objects.
   * @param {Event} event Event object containing the
   * result of our callback. Using event.target.result yields
   * an IDBRequest object for transactions.
   * @param {Boolean} synthetic Determines whether we use a mock
   * response to populate our daily log. Solely for testing purposes.
   */
  addNewLog (event, synthetic = false) {
    const db = event.target.result
    const tempObjectStore = db.transaction(['currentLogStore'], 'readwrite')
      .objectStore('currentLogStore')
    tempObjectStore.transaction.oncomplete = (event) => {}
    const req = new XMLHttpRequest()
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
        const response = JSON.parse(req.responseText)
        const tempStore = db.transaction('currentLogStore', 'readwrite').objectStore('currentLogStore')
        response.current_log = String(Date.now())
        tempStore.put(response)
      }
    }
    req.open('GET', synthetic ? this._MOCK_LOG : this._EMPTY_SCHEMA)
    req.send()
  }

  /**
     * Updates the daily log that should be initialized
     * when the daily log page is visited.
     *
     * @param {Number} timestamp Contains the UNIX timestamp
     * that will be used during our search transaction with indexedDB.
     * During this transaction, all daily logs are referenced until the
     * daily log with the same day as the given timestamp is found.
     * @param {Function} successCb Callback function that will handle
     * what kind of transaction to undergo
     * @param {Function} upgradeCb Callback function that should be
     * invoked when the version number or specified database changes.
     */
  transaction (successCb = (event) => {}, upgradeCb = this.init) {
    const request = window.indexedDB.open(this._dbName, this._version)
    request.onupgradeneeded = function (event) {
      upgradeCb.bind(this)
      upgradeCb(event)
    }

    request.onsuccess = function (event) {
      successCb.bind(this)
      successCb(event)
    }
  }
}

export { IndexedDBWrapper }
