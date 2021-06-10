import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'
import { Router, ROUTES } from '../utils/Router.js'
import { DateConverter } from '../utils/DateConverter.js'

/**
 * Component class used in order to add individual
 * tasks, notes, and events to the daily logging page
 * and monthly/weekly view
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class LogItem extends HTMLElement {
  /**
     * Constructor containing the business logic for
     * creating a new log item.
     */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this._itemEntry = {}
    this._itemEntry.logType = 'note'
    this._itemEntry.description = ''
    this._page = 'daily'
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    span {
                                      overflow-wrap:anywhere;
                                    }

                                    .icon {
                                        background-size: contain;
                                        display:inline-block;
                                        width:1em;
                                        height:1em;
                                        margin-right: 10px;
                                    }
                                    .icon:hover {
                                      cursor: pointer;
                                    }
                                    .trash-button-icon {
                                        background: url(./images/log-item_icons/trash-solid.svg) no-repeat center center;
                                    }
                                    .task-unfinished-icon {
                                        background: url(./images/log-item_icons/times-solid.svg) no-repeat center center;
                                    }
                                    .task-finished-icon {
                                        background: url(./images/log-item_icons/check-solid.svg) no-repeat center center;
                                    }
                                    .note-icon {
                                        background: url(./images/log-item_icons/note-solid.svg) no-repeat center center;
                                    }
                                    .event-icon {
                                        background: url(./images/log-item_icons/event-solid.svg) no-repeat center center;
                                    }
                                    .reflection-icon {
                                        background: url(./images/log-item_icons/reflection-solid.svg) no-repeat center center;
                                    }
                                    button {
                                        background-color: rgba(0,0,0,0);
                                        border:0;
                                        padding:0;
                                        font-size: inherit;
                                        visibility: hidden;
                                        margin-left: 100px;
                                    }
                                    button:hover {
                                      cursor: pointer;
                                    }
                                    #single-entry{
                                      margin:0;
                                    }
                                    #tasks {
                                      width: 90%;
                                    }
                                    </style>
                                    <span id="single-entry">
                                        <i class="icon ${this.getFASymbolClass()}"></i>
                                        <b>${this.getFormattedTime()}</b>
                                        <span id="tasks">${this._itemEntry.description}</span>
                                        <button type="button">
                                        <span class="icon trash-button-icon"></span>
                                        </button>
                                    </span>`

    const editable = this._itemEntry.editable
    /*
     * This block of code deals with the logic of editable
     * By editable we actually mean deletable
     * if editable = false, then the trash button will not show
     * Nevertheless, the user is still able to toggle the finished status
     */
    const that = this
    if (!editable) {
      this.shadowRoot.querySelector('button').style.display = 'none'
      // this.shadowRoot.querySelector('i').removeEventListener('click')
    } else {
      // When dealing with log of type task, we must update the task status when it is clicked.
      that.setHoverListeners()
      if (this._itemEntry.logType === 'task') {
        // finished/unfinished task listener
        this.shadowRoot.querySelector('i').addEventListener('click', (event) => {
          this._itemEntry.finished = !this._itemEntry.finished
          const wrapper = new IndexedDBWrapper('experimentalDB', 1)

          wrapper.transaction((event) => {
            const db = event.target.result

            const transaction = db.transaction(['currentLogStore'], 'readwrite')
            const store = transaction.objectStore('currentLogStore')
            store.openCursor().onsuccess = function (event) {
              const cursor = event.target.result
              if (cursor) {
                const router = new Router()
                const searchParams = router.url.searchParams
                let dateConverter
                let collectionName,
                  collection,
                  entry,
                  timestamp,
                  currTask
                switch (router.url.pathname) {
                  case ROUTES.daily:
                    timestamp = Number(searchParams.get('timestamp'))
                    dateConverter = new DateConverter(timestamp)
                    entry = cursor.value.$defs['daily-logs'].find((log) => {
                      return dateConverter.equals(Number(log.properties.date.time))
                    })
                    currTask = entry.properties.tasks.find((task) => {
                      return task.description === that._itemEntry.description
                    })
                    currTask.finished = that._itemEntry.finished
                    break
                  case ROUTES.weekly:
                    // @TODO
                    break
                  case ROUTES['collection-edit']:
                    // find the collection with the same name
                    collectionName = searchParams.get('name').replace(/\+/g, ' ')
                    collection = cursor.value.properties.collections.find((element) => {
                      return element.name === collectionName
                    })
                    currTask = collection.tasks.find((task) => {
                      return task.description === that._itemEntry.description
                    })
                    currTask.finished = that._itemEntry.finished
                }
                cursor.update(cursor.value)
              }
            }
          })
          this.render()
        })
      }

      // click event for the trash (delete) icon
      this.shadowRoot.querySelector('button').addEventListener('click', (event) => {
        // transaction to indexedDB to remove the corresponding task
        // create an instance of IndexedDBWrapper
        const wrapper = new IndexedDBWrapper('experimentalDB', 1)

        wrapper.transaction((event) => {
          const db = event.target.result

          const transaction = db.transaction(['currentLogStore'], 'readwrite')
          const store = transaction.objectStore('currentLogStore')
          store.openCursor().onsuccess = function (event) {
            const entryKey = (() => {
              let returnKey
              switch (that._itemEntry.logType) {
                case 'task':
                  returnKey = 'tasks'
                  break
                case 'note':
                  returnKey = 'notes'
                  break
                case 'event':
                  returnKey = 'events'
                  break
                case 'reflection':
                  returnKey = 'reflection'
                  break
              }
              return returnKey
            })()

            const cursor = event.target.result
            if (cursor) {
              const router = new Router()
              const searchParams = router.url.searchParams
              let dateConverter
              let collectionName,
                collection,
                entry,
                logItemList,
                timestamp,
                currTask

              switch (router.url.pathname) {
                case ROUTES.daily:
                  timestamp = Number(searchParams.get('timestamp'))
                  dateConverter = new DateConverter(timestamp)
                  entry = cursor.value.$defs['daily-logs'].find((log) => {
                    return dateConverter.equals(Number(log.properties.date.time))
                  })
                  entry.properties[entryKey] = entry.properties[entryKey].filter((item) => {
                    return !(item.description === that._itemEntry.description)
                  })
                  break
                case ROUTES.weekly:
                  break
                case ROUTES['collection-edit']:
                  // find the collection with the same name
                  collectionName = searchParams.get('name').replace(/\+/g, ' ')
                  collection = cursor.value.properties.collections.find((element) => {
                    return element.name === collectionName
                  })
                  // find the task with the same name as the log item
                  // delete the task when found
                  collection.tasks = collection.tasks.filter((task) => {
                    return !(task.description === that._itemEntry.description)
                  })
                  break
              }
              cursor.update(cursor.value)
            }
          }
        })

        this.parentElement.remove()
      })
    }
  }

  /**
     * Adds event listeners for all hover events on the collection item
     */
  setHoverListeners () {
    const singleEntry = this.shadowRoot.getElementById('single-entry')
    const trashBtn = this.shadowRoot.querySelector('button')

    // toggles visiblity of trash icon when mouse hovers
    trashBtn.parentElement.addEventListener('mouseenter', () => {
      trashBtn.style.visibility = 'visible'
    })

    trashBtn.parentElement.addEventListener('mouseleave', () => {
      trashBtn.style.visibility = 'hidden'
    })
  }

  /**
     * Setter for private field itemEntry, containing
     * the logType, description, and date of our entry.
     * @param {Object} entry JSON object containing the
     * new fields for our log item.
     */
  set itemEntry (entry) {
    // data massaging from UNIX timestamp given by key 'time'
    // to Date object given by key 'date'. This is done to reflect
    // the changes in our schema
    this._itemEntry = entry
    this._itemEntry.editable = true
    if (entry.logType === 'event') {
      this._itemEntry.date = new DateConverter(Number(entry.time))
    }
    this.render()
  }

  /**
     * Getter for field page, which denotes the
     * page in which the task is being created
     * @returns {Number} Number corresponding to
     * the key/value mappings from PAGES
     */
  get page () {
    return this._page
  }

  /**
     * Setter for field page, which denotes the
     * page in which the task is being created
     * @param {Number} page corresponding to
     * the key/value mappings from PAGES
     */
  set page (page) {
    this._page = page
  }

  /**
     * Getter for private field itemEntry, containing
     * the logType, description, and date of our entry.
     * @return {Object} JSON object containing the
     * new fields for our log item.
     */
  get itemEntry () {
    return this._itemEntry
  }

  /**
     * Get the corresponding time in military time for events.
     * @returns The corresponding time in military time. If the
     * log item is not an event, an empty string is returned.
     */
  getMilitaryTime () {
    if (this._itemEntry.logType !== 'event') {
      return ''
    }

    return `${this._itemEntry.date.getHours()}:${this._itemEntry.date.getMinutes()}`
  }

  /**
     * Gets the formatted time of the corresponding event. This method
     * formats time as HH:MM[AM,PM], where AM is displayed if the hour is
     * on the interval [0, 11]. Otherwise, PM is displayed.
     */
  getFormattedTime () {
    if (this._itemEntry.logType !== 'event') {
      return ''
    }
    const hours = this._itemEntry.date.getHours()
    const minutes = this._itemEntry.date.getMinutes()
    // Hours on the interval [0, 12)
    const hoursModded = hours % 12
    const AMPM = hours < 12 ? 'AM' : 'PM'
    const hoursFormatted = hoursModded === 0 ? 12 : hoursModded
    const minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`

    return `${hoursFormatted}:${minutesFormatted}${AMPM}`
  }

  /**
     * Private method to get the font awesome icons corresponding
     * to our log item.
     */
  getFASymbolClass () {
    switch (this._itemEntry.logType) {
      case 'task':
        return (this._itemEntry.finished) ? 'task-finished-icon' : 'task-unfinished-icon'
      case 'note':
        return 'note-icon'
      case 'event':
        return 'event-icon'
      case 'reflection':
        return 'reflection-icon'
      default:
        return ''
    }
  }
}

const PAGES = {
  'daily-log': 0,
  'weekly-view': 1,
  'collection-edit': 2
}

customElements.define('log-item', LogItem)

export { LogItem, PAGES }
