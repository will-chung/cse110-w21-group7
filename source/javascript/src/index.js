import { DateConverter } from './utils/DateConverter.js'
import { Router, ROUTES } from './utils/Router.js'
import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { Shelf } from './components/shelf.js'
import { Book } from './components/book.js'

document.addEventListener('DOMContentLoaded', (event) => {
  const addDailyLog = document.getElementById('cb')

  addDailyLog.onclick = function (event) {
    event.preventDefault()
    const params = new URLSearchParams()
    params.append('timestamp', (new DateConverter()).timestamp)
    const url = new URL(ROUTES.daily, location.origin)
    url.search = params
    new Router(url).navigate()
  }
})

const shelves = document.getElementsByTagName('book-shelf')

for (let i = 0; i < shelves.length; i++) {
  const shelf = shelves[i]
  shelf.label = 2021 + i
  const books = shelf.books
  for (let j = 0; j < books.length; j++) {
    books[j].title = j + 1
    books[j].shelf = shelf.label
  }
}
