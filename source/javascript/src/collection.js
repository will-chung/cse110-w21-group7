import { CollectionItem } from './components/CollectionItem.js'

function getLogInfoAsJSON (cb) {
  // TODO replace this with indexedDB transaction
  const request = new XMLHttpRequest()
  request.onreadystatechange = (event) => {
    cb.bind(this)
    if (request.status === 200 && request.readyState === XMLHttpRequest.DONE) {
      const response = event.target.response
      cb(response)
    }
  }

  request.open('GET', '/source/models/schema.json')
  request.send()
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
  const responseJson = JSON.parse(response)

  populateCollections(responseJson)
}

document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(populatePage)
})
