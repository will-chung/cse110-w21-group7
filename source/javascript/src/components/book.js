const template = document.createElement('template')

const NUM_BOOKS = 12
const BOOK_WIDTH = 350

const colors = []
colors.push()

template.innerHTML = `
	<style>
		:host {
			display: inline-block;
			width: 50px;
			height: 100px;

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
			background: red;
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
	<div class="book-color"></div>
	<div class="book-content">
		<span class="book-title"></span>
	</div>
`

class Book extends HTMLElement {
	constructor () {
		super()

		// create a shadow root for this web component
		this.attachShadow({ mode: 'open' })
		// attach cloned content of template to shadow DOM
		this.shadowRoot.appendChild(template.content.cloneNode(true))
	}

	get color () {
		return this.getAttribute('color')
	}

	set color (color) {
		this.setAttribute('color', color)
		const bookColor = this.shadowRoot.querySelector('.book-color')
		bookColor.style = 'background: ' + color
	}

	get title () {
		return this.getAttribute('title')
	}

	set title (month) {
		const title = this.getTitle(month)
		this.setAttribute('title', month)
		const bookTitle = this.shadowRoot.querySelector('.book-title')
		bookTitle.textContent = title
		this.offset(month)
	}

	get shelf () {
		return this.getAttribute('shelf')
	}

	set shelf (shelf) {
		this.setAttribute('shelf', shelf)
	}

	offset (month) {
		const parentWidth = this.parentElement.scrollWidth - BOOK_WIDTH
		// const offset = parentWidth / (NUM_BOOKS-1)
		const offset = 50
		this.style.left = offset * (month - 1) + 'px'
		this.style.zIndex = 12 - month
	}

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
