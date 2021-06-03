import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'

const myTemplate = document.createElement('template')

myTemplate.innerHTML = `

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans&display=swap');

    :host {
      display: block;
      height: 175px;
      font-family: 'Merriweather Sans', sans-serif;
    }

    .shelf-label {
      display: none;
      border-bottom: 2px solid grey;
      // display: flex;
      align-items: center;
      width: 100%;
      height: 20%;
      color: grey;
      font-size: 24px;
    }

    #label {
      padding-left: 12.5px;
    }

    .shelf-content {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      height: 80%;
    }
  </style>
  <div class="shelf-label"><span id="label"></span></div>
  <div class="shelf-content"></div>
`

class Shelf extends HTMLElement {
  constructor () {
    super()

    // create a shadow root for this web component
    this.attachShadow({ mode: 'open' })
    // attach cloned content of template to shadow DOM
    this.shadowRoot.appendChild(myTemplate.content.cloneNode(true))
    this.books = this.createBooks()

    const that = this
    const wrapper = new IndexedDBWrapper('experimentalDB', 1)

    wrapper.transaction((event) => {
      const db = event.target.result
      const transaction = db.transaction(['currentLogStore'], 'readonly') // mode should be readonly
      const store = transaction.objectStore('currentLogStore')
      // this gets all entries and store them as an array, pass in a key, what's the key?
      const getReq = store.getAll()

      getReq.onsuccess = (event) => {
        const allEntries = getReq.result
      }
      store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result
        // this cursor hold on to the event, we have fetched the data in the db
        if (cursor) {
          // current date
          const dailyLogs = cursor.value.$defs['daily-logs']

          that._books.forEach((book, monthIndex) => {
            if (that.hasEntryForYearMonth(dailyLogs, monthIndex)) {
              book.color = '#ee6c4d'
              book.makeClickable()
              console.log('not found')
            }
          })
        }
      }
    })
  }

  /**
   * Subroutine used in order to determine whether there exists
   * daily logs with the given month and year.
   * @param {Object[]} dailyLogs Array of JSON objects containing the
   * daily log entries to check.
   * @param {Number} month Number containing the month (indexed from 1 to 12 inclusive)
   * with which to compare the date of each daily log
   * @return {Boolean} boolean value that determines whether there exists
   * a daily log with the given month and year
   */
  hasEntryForYearMonth (dailyLogs, month) {
    const year = Number(this.label)
    // finds if a daily log with the given year and month exists
    const result = dailyLogs.find((log) => {
      const timestamp = Number(log.properties.date.time)
      const date = new Date(timestamp)
      return (date.getFullYear() === year) && (date.getMonth() === month)
    })

    return !(result === undefined)
  }

  get label () {
    return this.getAttribute('label')
  }

  set label (label) {
    this.setAttribute('label', label)
    const shelfLabel = this.shadowRoot.querySelector('#label')
    shelfLabel.textContent = label
    this.updateBooks()
  }

  get books () {
    return this._books
  }

  set books (books) {
    const content = this.shadowRoot.querySelector('.shelf-content')
    for (let i = 0; i < books.length; i++) {
      const book = books[i]
      content.append(book)
      book.title = i + 1
      book.shelf = this.label
    }
    this._books = books
  }

  createBooks () {
    // create one book for each month
    const books = []
    for (let i = 0; i < 12; i++) {
      const book = document.createElement('book-item')
      books.push(book)
    }
    return books
  }

  updateBooks () {
    this.books.forEach(book => {
      book.shelf = this.label
    })
  }
}

customElements.define('book-shelf', Shelf)

export { Shelf }
