import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'

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
    // Unfortunately this cannot be made a private field, since ESLint does not properly
    // lint private fields.
    this._itemEntry = {}
    /**
     * {
            "description": "Unfinished task for collection one",
            "logType": "task",
            "finished": false
        }
     */
    this._itemEntry.logType = 'note'
    this._itemEntry.description = ''
    this._page = 'daily'
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
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
                                        background: url(../images/log-item_icons/trash-solid.svg) no-repeat center center;
                                    }
                                    .task-unfinished-icon {
                                        background: url(../images/log-item_icons/times-solid.svg) no-repeat center center;
                                    }
                                    .task-finished-icon {
                                        background: url(../images/log-item_icons/check-solid.svg) no-repeat center center;
                                    }
                                    .note-icon {
                                        background: url(../images/log-item_icons/note-solid.svg) no-repeat center center;
                                    }
                                    .event-icon {
                                        background: url(../images/log-item_icons/event-solid.svg) no-repeat center center;
                                    }
                                    .reflection-icon {
                                        background: url(../images/log-item_icons/reflection-solid.svg) no-repeat center center;
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
                                        <b>${this.getMilitaryTime()}</b>
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
    if (!editable) {
      // console.log('toggling display...')
      // console.log(this.shadowRoot.querySelector('button'));
      this.shadowRoot.querySelector('button').style.display = 'none'
      // console.log("not editable")
    } else {
      // console.log("editable")
      // When dealing with log of type task, we must update the task status when it is clicked.
      const that = this
      if (this._itemEntry.logType === 'task') {
        this.shadowRoot.querySelector('i').addEventListener('click', (event) => {
          this._itemEntry.finished = !this._itemEntry.finished
          // @TODO indexedDB transactions for check/uncheck tasks
          const wrapper = new IndexedDBWrapper('experimentalDB', 1)

          wrapper.transaction((event) => {
            const db = event.target.result

            const transaction = db.transaction(['currentLogStore'], 'readwrite')
            const store = transaction.objectStore('currentLogStore')
            store.openCursor().onsuccess = function (event) {
              const cursor = event.target.result
              let collectionName,
                collection,
                currTask
              if (cursor) {
                // @TODO check route to make this decision
                switch (that._page) {
                  case PAGES['daily-log']:
                    // @TODO
                    break
                  case PAGES['weekly-view']:
                    // @TODO
                    break
                  case PAGES['collection-edit']:
                    // find the collection with the same name
                    collectionName = cursor.value.current_collection
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
            const cursor = event.target.result
            let collectionName,
              collection
            if (cursor) {
              switch (that._page) {
                case PAGES['daily-log']:
                  // @TODO
                  break
                case PAGES['weekly-view']:
                  // @TODO
                  break
                case PAGES['collection-edit']:
                  // find the collection with the same name
                  collectionName = cursor.value.current_collection
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
        // call transaction, with one argument that is a callback function
        // callback function should have a parameter event

        this.parentElement.remove()
      })
      // this.setHoverListeners()
    }
  }

  /*
  * Adds event listeners for all hover events on the collection item
  */
  setHoverListeners () {
    const singleEntry = this.shadowRoot.getElementById('single-entry')
    const trashBtn = this.shadowRoot.querySelector('button')

    // toggles visiblity of trash icon when mouse hovers
    this.parentElement.addEventListener('mouseenter', () => {
      trashBtn.style.visibility = 'visible'
    })

    this.parentElement.addEventListener('mouseleave', () => {
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
    if (entry.logType === 'event') {
      entry.date = new Date(Number(entry.time))
      delete entry.time
    }
    entry.editable = true
    this._itemEntry = entry
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
