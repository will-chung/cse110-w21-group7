const myTemplate = document.createElement('template')

myTemplate.innerHTML = `

	<style>
		@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans&display=swap');

		:host {
			display: block;
			height: 175px;
			font-family: 'Merriweather Sans', sans-serif;
		}

		.shelf-label {
			display: none;
			border-bottom: 2px solid grey;
			// display: flex;
			align-items: center;
			width: 100%;
			height: 20%;
			color: grey;
			font-size: 24px;
		}

		#label {
			padding-left: 12.5px;
		}

		.shelf-content {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			width: 100%;
			height: 80%;
		}
	</style>
	<div class="shelf-label"><span id="label"></span></div>
	<div class="shelf-content"></div>
`

class Shelf extends HTMLElement {
	constructor () {
		super()

		this.booksArray = []

		// create a shadow root for this web component
		this.attachShadow({ mode: 'open' })
		// attach cloned content of template to shadow DOM
		this.shadowRoot.appendChild(myTemplate.content.cloneNode(true))

		this.books = this.createBooks()
	}

	get label () {
		return this.getAttribute('label')
	}

	set label (label) {
		this.setAttribute('label', label)
		const shelfLabel = this.shadowRoot.querySelector('#label')
		shelfLabel.textContent = label
		this.updateBooks()
	}

	get books () {
		return this.booksArray
	}

	set books (books) {
		const content = this.shadowRoot.querySelector('.shelf-content')
		for (let i = 0; i < books.length; i++) {
			const book = books[i]
			content.append(book)
			book.title = i + 1
			book.shelf = this.label
		}
		this.booksArray = books
	}

	createBooks () {
		// create one book for each month
		const books = []
		for (let i = 0; i < 12; i++) {
			const book = document.createElement('book-item')
			books.push(book)
		}
		return books
	}

	updateBooks () {
		this.books.forEach(book => {
			book.shelf = this.label
		})
	}
}

customElements.define('book-shelf', Shelf)
