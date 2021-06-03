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
    this._entry = {}
    this._entry.description = ''
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                      </style>
                                      <span id="single-entry">
                                          <a href="#" class="result" target="_blank">${this._itemEntry.description}</a>
                                      </span>`
  }

  /**
       * Setter for private field itemEntry, containing
       * the logType, description, and date of our search
       * item.
       * @param {Object} entry JSON object containing the
       * new fields for our search item.
       */
  set itemEntry (entry) {
    entry.editable = true
    this._itemEntry = entry
    this.render()
  }

  /**
       * Getter for private field itemEntry, containing
       * the logType, description, and date of our search
       * item.
       * @return {Object} JSON object containing the
       * new fields for our search item.
       */
  get itemEntry () {
    return this._itemEntry
  }
}

customElements.define('search-item', SearchItem)
