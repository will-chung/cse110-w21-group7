import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'
import { DateConverter } from '../utils/DateConverter.js'

/**
 * Component class for individual columns for daily log information on 'weekly.html'
 * @author Yuzi Lyu <yul134@ucsd.edu>, Noah Teshima <nteshima@ucsd.edu>
 */
class WeeklyViewItem extends HTMLElement {
  /**
       * Constructor containing the business logic for
       * creating a new container item.
       */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    // Unfortunately this cannot be made a private field, since ESLint does not properly
    // lint private fields.
    this._entry = { name: '' }
    // this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    .single-weekday {
                                        display: flex;
                                        flex-direction: column;
                                        flex-wrap: wrap;
                                        margin-left: 10px;
                                        margin-right: 10px;
                                    }
                                    #weekday-entries {
                                        border-style: solid;
                                        border-width: 5px;
                                        border-radius: 20px;
                                        display: flex;
                                        flex-direction: column;
                                        flex-wrap: wrap;
                                        margin: auto;
                                        align-items: flex-start;
                                    }
                                    #weekday-entries > li {
                                        margin-top: 5px;
                                        margin-bottom: 5px;
                                    }
                                    a {
                                        font-size: 40px;
                                    }
                                      </style>
                                    <div class="single-weekday">
                                        <a href="#"></a>
                                        <ul id="weekday-entries">
                                        </ul>
                                    </div>`

    const ul = this.shadowRoot.getElementById('weekday-entries')
    const tasks = this._entry.properties.tasks
    const notes = this._entry.properties.notes
    const events = this._entry.properties.events
    const reflection = this._entry.properties.reflection

    tasks.forEach((task, index) => {
      const taskItem = this.getEntryToWeeklyView(task)
      const li = document.createElement('li')
      li.appendChild(taskItem)
      ul.appendChild(li)
    })
    notes.forEach((notes, index) => {
      const noteItem = this.getEntryToWeeklyView(notes)
      const li = document.createElement('li')
      li.appendChild(noteItem)
      ul.appendChild(li)
    })
    events.forEach((event, index) => {
      const eventItem = this.getEntryToWeeklyView(event)
      const li = document.createElement('li')
      li.appendChild(eventItem)
      ul.appendChild(li)
    })
    reflection.forEach((reflection, index) => {
      const reflectionItem = this.getEntryToWeeklyView(reflection)
      const li = document.createElement('li')
      li.appendChild(reflectionItem)
      ul.appendChild(li)
    })
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
    entry.editable = false
    logItem.entry = entry
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
