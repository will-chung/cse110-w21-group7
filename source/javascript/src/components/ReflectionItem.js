import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'
import { DateConverter } from '../utils/DateConverter.js'
import { Router, ROUTES } from '../utils/Router.js'

/**
 * Component class for creating the reflection field
 * on the daily log.
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class ReflectionItem extends HTMLElement {
  /**
       * Constructor containing the business logic for
       * creating a new reflection item.
       */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    // slider is on interval [_MOOD_MIN, _MOOD_MAX]
    this._MOOD_MIN = 0
    this._MOOD_MAX = 99
    // Unfortunately this cannot be made a private field, since ESLint does not properly
    // lint private fields.
    this._entry = {
      type: 'number',
      multipleOf: 1,
      minimum: 0,
      exclusiveMaximum: 100,
      value: 50,
      description: 'Daily mood on a range of 0-99.'
    }
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
                                    .angry-icon {
                                      background: url(../images/reflection-item_icons/angry-regular.svg) no-repeat center center;
                                    }
                                    .sad-icon {
                                      background: url(../images/reflection-item_icons/sad-regular.svg) no-repeat center center;
                                    }
                                    .okay-icon {
                                      background: url(../images/reflection-item_icons/okay-regular.svg) no-repeat center center;
                                    }
                                    .happy-icon {
                                      background: url(../images/reflection-item_icons/great-regular.svg) no-repeat center center;
                                    }
                                    .great-icon {
                                      background: url(../images/reflection-item_icons/happy-regular.svg) no-repeat center center;
                                    }
                                  #mood-slider {
                                    font-size:40px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: space-around;
                                  }
                                  #mood{
                                    margin:auto;
                                    width: 75vw;
                                  }
                                  label {
                                    font-family: 'Montserrat', sans-serif;
                                    color: white;
                                    text-transform: uppercase;
                                    font-weight: bold;
                                    margin-bottom: 30px;
                                  }
                                  .iconokay-icon {
                                    color: white;
                                  }
                                  h1{
                                    font-family: "Montserrat", sans-serif;
                                    margin-top: 15px;
                                    font-size: 38px;
                                    line-height:40px;
                                    color: #e0fbfc;
                                  }
                                 </style> 
                                      
                                        <div id="mood-slider">
                                            <h1>Today, I'm feeling</h1>
                                            <i class="fas fa-laugh-wink"></i>
                                            <i class="icon ${this.getFASymbolClass()}"></i>
                                            <label for="mood">${this.getMoodWord()}</label>
                                            <input type="range" id="mood" name="mood" value="${this._entry.value}" min="${this._MOOD_MIN}" max="${this._MOOD_MAX}">
                                            
                                        </div>
                                  `
    const that = this
    this.shadowRoot.getElementById('mood').addEventListener('change', (event) => {
      that._entry.value = event.target.value
      const wrapper = new IndexedDBWrapper('experimentalDB', 1)
      wrapper.transaction((event) => {
        const db = event.target.result

        const store = db.transaction(['currentLogStore'], 'readwrite')
          .objectStore('currentLogStore')
        store.openCursor().onsuccess = function (event) {
          const cursor = event.target.result
          if (cursor) {
            // current Log we are viewing
            const router = new Router()
            const searchParams = router.url.searchParams

            const timestamp = Number(searchParams.get('timestamp'))
            const dateConverter = new DateConverter(timestamp)
            cursor.value.$defs['daily-logs'].forEach((log, index) => {
              // check if we indexed the correct daily log to change
              if (dateConverter.equals(Number(log.properties.date.time))) {
                log.properties.mood.value = Number(that._entry.value)
              }
            })

            cursor.update(cursor.value)
          }
        }
      })
      this.render()
    })
  }

  /**
     * Getter for the entry data corresponding to this
     * component's reflection.
     * @returns {Object} JSON object containing the reflection
     * data, such as mood.
     */
  get entry () {
    return this._entry
  }

  /**
     * Setter for the entry data corresponding to this
     * component's reflection.
     * @param {Object} entry JSON object containing the
     * new reflection data.
     */
  set entry (entry) {
    this._entry = entry
    this.render()
  }

  /**
     * Get a word corresponding to the mood exhibited on this
     * component's input value.
     * @returns {String} String containing the corresponding word
     * to use to describe the user's mood.
     */
  getMoodWord () {
    if (this._entry.value < 20) {
      return 'angry'
    } else if (this._entry.value < 40) {
      return 'sad'
    } else if (this._entry.value < 60) {
      return 'okay'
    } else if (this._entry.value < 80) {
      return 'happy'
    } else {
      return 'great'
    }
  }

  /**
     * Private method to get the font awesome icons corresponding
     * to our log item.
     */
  getFASymbolClass () {
    let returnClass
    switch (this.getMoodWord()) {
      case 'angry':
        returnClass = 'angry-icon'
        break
      case 'sad':
        returnClass = 'sad-icon'
        break
      case 'okay':
        returnClass = 'okay-icon'
        break
      case 'happy':
        returnClass = 'happy-icon'
        break
      case 'great':
        returnClass = 'great-icon'
        break
      default:
        returnClass = ''
    }
    return returnClass
  }
}

customElements.define('reflection-item', ReflectionItem)
