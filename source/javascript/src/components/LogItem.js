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
    this._itemEntry.logType = 'note'
    this._itemEntry.description = ''
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    .icon {
                                        background-size: contain;
                                        display:inline-block;
                                        width:1em;
                                        height:1em;
                                    }
                                    .trash-button-icon {
                                        background: url(../../../images/log-item_icons/trash-solid.svg) no-repeat center center;
                                    }
                                    .task-unfinished-icon {
                                        background: url(../../../images/log-item_icons/times-solid.svg) no-repeat center center;
                                    }
                                    .task-finished-icon {
                                        background: url(../../../images/log-item_icons/check-solid.svg) no-repeat center center;
                                    }
                                    .note-icon {
                                        background: url(../../../images/log-item_icons/note-solid.svg) no-repeat center center;
                                    }
                                    .event-icon {
                                        background: url(../../../images/log-item_icons/event-solid.svg) no-repeat center center;
                                    }
                                    button {
                                        background-color: rgba(0,0,0,0);
                                        border:0;
                                        padding:0;
                                        font-size: inherit;
                                    }
                                    </style>
                                    <span>
                                        <i class="icon ${this.getFASymbolClass()}"></i>
                                        <b>${this.getMilitaryTime()}</b>
                                        <span>${this._itemEntry.description}</span>
                                        <button type="button">
                                        <span class="icon trash-button-icon"></span>
                                        </button>
                                    </span>`
    this.shadowRoot.querySelector('button').addEventListener('click', (event) => {
      this.parentElement.remove()
    })
  }

  /**
     * Setter for private field itemEntry, containing
     * the logType, description, and date of our entry.
     * @param {Object} entry JSON object containing the
     * new fields for our log item.
     */
  set itemEntry (entry) {
    this._itemEntry = entry
    console.log(this._itemEntry)
    this.render()
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
        default:
        return ''
    }
  }
}

customElements.define('log-item', LogItem)
