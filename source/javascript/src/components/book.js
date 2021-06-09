import { Router, ROUTES } from '../utils/Router.js'

// template element for default configuration (no entries in book)
const template = document.createElement('template')
// template element for interactive configuration (entries in book)
const interactive = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      width: 3.25vw;
      height: 100px;

      font-size:1.25vw;
      box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
      border-radius: 4px;
    }

    .book-color {
      background: grey;
      width: 100%;
      height: 10%;
      border-radius: 4px 4px 0px 0px;
    }

    .book-content {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background: white;
      width: 100%;
      height: 90%;
    }

    .book-title {
      transform: rotate(90deg);
    }
  </style>
  <div class="book-color"></div>
  <div class="book-content">
    <span class="book-title"></span>
  </div>
`

interactive.innerHTML = `
  <style>
    :host {
      display: inline-block;
      width: 3.25vw;
      height: 100px;

      font-size:1.25vw;
      box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
      border-radius: 4px;

      transition: transform 1s;
    }

    :host(:hover) {
      cursor: pointer;
      transform: translateY(-20px);
    }

    :host(:hover) > .book-content > .book-title {
      transform: rotate(0deg);
    }

    .book-color {
      background: grey;
      width: 100%;
      height: 10%;
      border-radius: 4px 4px 0px 0px;
    }

    .book-content {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background: white;
      width: 100%;
      height: 90%;
    }

    .book-title {
      transform: rotate(90deg);
      transition: transform 1s;
    }
  </style>
`

/**
 * Component class used to create a new book containing
 * the month of a given year. This component is clickable,
 * and allows the user to navigate to the weekly view and
 * see daily log entries for the given month.
 * @author William Chung <wchung@ucsd.edu>
 */
class Book extends HTMLElement {
  /**
   * Constructor for creating a new book component. Note
   * that initializing a book does not set the title of the
   * book itself. The title of the book can be set using
   * the setter for the field 'title'
   */
  constructor () {
    super()

    // create a shadow root for this web component
    this.attachShadow({ mode: 'open' })
    // attach cloned content of template to shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  /**
   * Makes a book interactive by adding a transition on hover, adding an event
   * listener to navigate to Weekly View on click, and changing color from grey
   */
  makeInteractive () {
    // replace style to add transition on hover
    this.shadowRoot.removeChild(this.shadowRoot.querySelector('style'))
    this.shadowRoot.appendChild(interactive.content.cloneNode(true))

    // navigate to Weekly View on click
    this.addEventListener('click', () => {
      // Get month and year of the clicked book
      const month = this.title
      const year = this.shelf

      const params = new URLSearchParams()
      params.append('year', year)
      params.append('month', month)
      params.append('displayFirstOfMonth', true)
      const url = new URL(ROUTES.weekly, location.origin)
      url.search = params
      new Router(url).navigate()
    })

    // change color from grey
    this.color = '#ee6c4d'
  }

  /**
   * Getter used to determine what color is being used for the book componemt.
   * @returns {String} String reference containing the color being used for
   * the book.
   */
  get color () {
    return this.getAttribute('color')
  }

  /**
   * Setter used to define the color that should be used for the book's background.
   * @param {String} color String reference containing the color that
   * should be used for the book.
   */
  set color (color) {
    this.setAttribute('color', color)
    const bookColor = this.shadowRoot.querySelector('.book-color')
    bookColor.style = 'background: ' + color
  }

  /**
   * Gets the title of a book (the month that a book represents).
   * @returns {String} String reference containing the title of the book.
   */
  get title () {
    return this.getAttribute('title')
  }

  /**
   * Sets the the title of a book (the month that a book represents).
   * @param {Number} month The month that will serve as the title of a book
   */
  set title (month) {
    const title = this.getTitle(month)
    this.setAttribute('title', month)
    const bookTitle = this.shadowRoot.querySelector('.book-title')
    bookTitle.textContent = title
    this.offset(month)
  }

  /**
   * Gets the shelf that book belongs to.
   * @returns {String} String reference containing the label of the shelf the book belongs to.
   */
  get shelf () {
    return this.getAttribute('shelf')
  }

  /**
   * Sets the shelf that a book belongs to.
   * @param {String} shelf The label of the shelf
   */
  set shelf (shelf) {
    this.setAttribute('shelf', shelf)
  }

  /**
   * Helper method to offset each book from beginning based on the book's month.
   * @param {Number} month The month of the book to offset
   */
  offset (month) {
    const offset = 50
    this.style.left = offset * (month - 1) + 'px'
  }

  /**
   * Getter used to return the corresponding month for
   * this book.
   * @param {Number} month Integer containing the month
   * corresponding to the month that should be returned.
   * Months are indexed from 1-12 inclusive,
   * @returns {String} String containing the month that
   * should be displayed on the book.
   */
  getTitle (month) {
    switch (month) {
      case 1:
        return 'JAN'
      case 2:
        return 'FEB'
      case 3:
        return 'MAR'
      case 4:
        return 'APR'
      case 5:
        return 'MAY'
      case 6:
        return 'JUN'
      case 7:
        return 'JUL'
      case 8:
        return 'AUG'
      case 9:
        return 'SEP'
      case 10:
        return 'OCT'
      case 11:
        return 'NOV'
      case 12:
        return 'DEC'
    }
  }
}

customElements.define('book-item', Book)

export { Book }
