import { DateConverter } from '../utils/DateConverter.js'
import { Router, ROUTES } from '../utils/Router.js'

/**
 * Component class used to list daily-logs on
 * the search page.
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class SearchItem extends HTMLElement {
  /**
       * Constructor containing the business logic for
       * creating a new search item.
       */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    // Unfortunately this cannot be made a private field, since ESLint does not properly
    // lint private fields.
    this._entry = {
      time: undefined,
      tasks: [],
      notes: [],
      events: [],
      reflection: [],
      type: 'daily-log'
    }
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    #single-entry {
                                      width: 50vw;
                                    }
                                    #log-entries {
                                      display: flex;
                                      flex-direction: column;
                                      flex-wrap: wrap;
                                    }
                                    .result {
                                      color: #ee6c4d;
                                    }
                                      </style>
                                      <span id="single-entry">
                                          <a href="#" class="result" target="_blank">${this.getDate()}</a>
                                          <ul id="log-entries">
                                          </ul>
                                      </span>`
    const that = this
    // If we are displaying results for daily logs
    if (this._entry.type === 'daily-log') {
      // this.populateLogEntries()
      this.shadowRoot.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault()
        const params = new URLSearchParams()
        params.append('timestamp', Number(that._entry.time))
        const url = new URL(ROUTES.daily, window.location.origin)
        url.search = params
        new Router(url).navigate()
      })
      this.populateLogEntries()
    } else {
      this.shadowRoot.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault()
        const url = new URL(ROUTES['collection-edit'], window.location.origin)
        url.searchParams.append('name', encodeURIComponent(that._entry.name.trim()))
        new Router(url).navigate()
      })
      this.populateCollectionTasks()
    }
  }

  /**
   * Subroutine used in order to show the relevant tasks, notes,
   * events, and reflection data in the contained daily log as
   * list items.
   */
  populateLogEntries () {
    this.addAsListItems(this._entry.tasks)
    this.addAsListItems(this._entry.notes)
    this.addAsListItems(this._entry.events)
    this.addAsListItems(this._entry.reflection)
  }

  /**
   * Subroutine used in order to show the relevant tasks
   * in the contained collection as list items.
   */
  populateCollectionTasks () {
    this.addAsListItems(this._entry.tasks)
  }

  /**
   * Business/presentation logic subroutine used in order
   * to display entries as list items on the current search component.
   * @param {Object[]} list Array of JSON objects with which to create
   * list entries
   */
  addAsListItems (list) {
    const that = this
    list.forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item.item.description
      that.shadowRoot.getElementById('log-entries').appendChild(li)
    })
  }

  /**
   * Subroutine used in order to show the date of the
   * entry being shown
   */
  getDate () {
    const timestamp = this._entry.time
    const date = new DateConverter(timestamp)
    return date.toLocaleDateString()
  }

  /**
       * Setter for private field entry, containing
       * the tasks, notes, events, reflections, description,
       * and date of our search item.
       * @param {Object} entry JSON object containing the
       * new fields for our search item.
       */
  set entry (entry) {
    this._entry = entry
    this.render()
  }

  /**
       * Getter for private field entry, containing
       * the tasks, notes, events, reflections, description,
       * and date of our search item.
       * @return {Object} JSON object containing the
       * new fields for our search item.
       */
  get entry () {
    return this._entry
  }
}

customElements.define('search-item', SearchItem)
