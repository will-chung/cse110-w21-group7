import { CollectionItem } from './components/CollectionItem.js'
import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'

const addBtn = document.getElementById('add')

addBtn.addEventListener('click', () => {
  location.pathname = '/source/html/collection-edit.html'
})

// function getLogInfoAsJSON (cb) {
//   // TODO replace this with indexedDB transaction
//   const request = new XMLHttpRequest()
//   request.onreadystatechange = (event) => {
//     cb.bind(this)
//     if (request.status === 200 && request.readyState === XMLHttpRequest.DONE) {
//       const response = event.target.response
//       cb(response)
//     }
//   }

//   request.open('GET', '/source/models/schema.json')
//   request.send()
// }

/**
 * the daily log information corresponding to the given date.
 * If there is no daily log information for the given date,
 * a new daily log is created if the date is the present day.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @throws Error object if date reference is null, undefined. Otherwise,
 * an error is thrown if the given date is not the present day and failed
 * to retrieve log info for given day.
 * @returns JSON type response, containing the information needed to
 * initialize the daily log.
 */
function getLogInfoAsJSON (cb) {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readonly')
    const store = transaction.objectStore('currentLogStore')
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        // JSON as per the schema.json file
        console.log(cursor.value.properties.collections)
        // cb(cursor.value)
        // cursor.continue()
      }
    }
  })
}

/* Business logic */

/**
 * Business logic subroutine used to fill the page with
 * all available collections. We assume order does not matter
 * here.
 * @param {Business} response XMLHttpRequest response object
 * containing the collection data surfaced from our backend
 */
function populateCollections (response) {
  function populateCollection (collection) {
    const collectionItem = new CollectionItem()
    collectionItem.entry = { name: collection.name }
    return collectionItem
  }

  const collections = response.properties.collections
  const container = document.querySelector('.collection-area')
  collections.forEach((collection, index) => {
    const collectionItem = populateCollection(collection)
    container.appendChild(collectionItem)
  })
}

/**
 * Business logic to call all necessary subroutines
 * to display collections on the page
 * @param {Object} response XMLHttpRequest response object
 * containing the collection data surfaced from our backend
 */
function populatePage (response) {
  populateCollections(response)
}

document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(populatePage)
})
