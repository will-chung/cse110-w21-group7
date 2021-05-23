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
    this.shadowRoot.innerHTML = `
                                      <span>
                                        <div>
                                            <input type="range" id="mood" name="mood" value="${this._entry.value}" min="${this._MOOD_MIN}" max="${this._MOOD_MAX}">
                                            <label for="mood">Today, I'm feeling ${this.getMoodWord()}</label>
                                        </div>
                                      </span>`
    this.shadowRoot.getElementById('mood').addEventListener('change', (event) => {
      this._entry.value = event.target.value
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
    if (this._entry.value < 33) {
      return 'bad'
    } else if (this._entry.value < 66) {
      return 'neutral'
    } else {
      return 'good'
    }
  }
}

customElements.define('reflection-item', ReflectionItem)
