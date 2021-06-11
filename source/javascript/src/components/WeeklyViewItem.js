import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'
import { DateConverter } from '../utils/DateConverter.js'

/**
 * Component class for individual columns for daily log information on 'weekly.html'
 * @author Yuzi Lyu <yul134@ucsd.edu>
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class WeeklyViewItem extends HTMLElement {
  /**
     * Constructor containing the business logic for
     * creating a new container item.
     */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this._entry = { name: '' }
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    #single-weekday {
                                      overflow-wrap:break-word;
                                      padding: 5px;
                                      display: flex;
                                      flex-direction: column;
                                      flex-wrap: wrap;
                                      align-items:flex-start;

                                    }
                                    #single-weekday > p {
                                      font-family: "Montserrat", sans-serif;
                                      padding:10px;
                                      font-size: 1vw;
                                      margin:10px;
                                      box-shadow: 5px 10px 5px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
                                    }
                                    #single-weekday p:nth-child(odd) {
                                      background: rgb(247,240,63);
background: linear-gradient(335deg, rgba(247,240,63,1) 0%, rgba(254,255,156,1) 100%);
                                      border-bottom-right-radius:10px;
                                      border-bottom-left-radius:10px;
                                    }
                                    #single-weekday p:nth-child(even) {
                                      background: rgb(247,240,63);
background: linear-gradient(335deg, rgba(247,240,63,1) 0%, rgba(254,255,156,1) 100%);
                                      border-bottom-right-radius:10px;
                                      border-bottom-left-radius:10px;
                                    }
                                    #single-weekday p:hover {
                                      background: white;
                                    }
                                    .weekday-entries {
                                        // border-style: solid;
                                        // border-left-style: none;
                                        // border-right-style:none;
                                        // border-width: 2px;
                                        // border-radius: 5px;
                                        margin:auto;
                                        text-align:left;
                                    }
                                    a {
                                        font-size: 40px;
                                    }
                                      </style>
                                    <div id="single-weekday">
                                        
                                    </div>`

    const weekdayCol = this.shadowRoot.getElementById('single-weekday')

    const tasks = this._entry.properties.tasks
    const notes = this._entry.properties.notes
    const events = this._entry.properties.events
    const reflection = this._entry.properties.reflection

    const populateItems = (items) => {
      items.forEach((item, index) => {
        const journalItem = this.getEntryToWeeklyView(item)
        const row = this.makeRow(journalItem)
        journalItem.shadowRoot.querySelector('button').style.display = 'none'
        weekdayCol.appendChild(row)
      })
    }

    populateItems(reflection)
    populateItems(events)
    populateItems(tasks)
    populateItems(notes)
  }

  /**
     * Subroutine for creating one row of logItem
     * @returns {p} The row that should be appended to the div
     */
  makeRow (singleLog) {
    const row = document.createElement('p')
    row.setAttribute('class', 'weekday-entries')
    row.appendChild(singleLog)
    return row
  }

  /**
     * Getter for getting the date correpsonding to the given
     * weekly view item
     * @returns {String} The date corresponding to the weekly view
     * item being displayed, corresponding to
     */
  getDate () {
    const timestamp = this._entry.date.time
    const dateConverter = new DateConverter(timestamp)
    return dateConverter.toLocaleDateString()
  }

  /**
     * Subroutine to add a task/note/event to the weekly view.
     * @param {Object} entry JSON object containing the task/note/event
     * data to add to the weekly view item.
     * @returns {LogItem} LogItem object containing the representation of
     * the given entry as a log item in the weekly view.
     */
  getEntryToWeeklyView (entry) {
    const logItem = document.createElement('log-item')
    logItem.itemEntry = entry
    logItem.dataset.timestamp = this._entry.properties.date.time
    logItem.itemEntry.editable = false
    return logItem
  }

  /**
     * Setter for private field entry, containing
     * the name of our collection.
     * @param {Object} entry JSON object containing the
     * new fields for our log item.
     */
  set entry (entry) {
    this._entry = entry
    this.render()
  }

  /**
     * Getter for private field entry, containing the
     * name of our collection.
     * @return {Object} JSON object containing the
     * new fields for our collection item.
     */
  get entry () {
    return this._entry
  }
}

customElements.define('weekly-view-item', WeeklyViewItem)

export { WeeklyViewItem }
