import { CollectionItem, wrapper } from './components/CollectionItem.js'

const customAdd = document.getElementById('cb')

/**
 * Onclick of the add button on the Collection page will prompt the
 * user for the name and create a new collection with the given name.
 */
customAdd.addEventListener('click', () => {
  const collectionName = window.prompt('Please enter the name of your new collection:')
  addCollection(collectionName)
})

/**
 * Add new collection to database with given name.
 * @author William Chung <wchung@ucsd.edu>
 * @param collectionName Name to be given to new collection.
 */
function addCollection (collectionName) {
  let repeat
  // if user presses 'Cancel' on prompt
  if (collectionName === null) {
    return
  }

  const newCollection = new CollectionItem()
  newCollection.entry = { name: collectionName }

  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readwrite')
    const objectStore = transaction.objectStore('currentLogStore')
    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        const json = cursor.value

        const collections = json.properties.collections

        repeat = collections.find(collection => collection.name === collectionName)

        if (repeat !== undefined) {
          window.alert('Cannot create collections of the same name!')
        } else {
          const newCollectionObj = {
            type: 'array',
            name: collectionName,
            logs: [
            ],
            tasks: [
            ],
            images: [
            ],
            videos: [
            ]
          }
          collections.push(newCollectionObj)

          // Save changes
          const requestUpdate = cursor.update(json)
          requestUpdate.onerror = function (event) {
            // Error - Data did not update
          }
          requestUpdate.onsuccess = function (event) {
            // Success - the data is updated!
            console.log('successfully added "' + collectionName + '"')
          }
        }
      }
    }
  })

  if (repeat !== undefined) {
    document.querySelector('.collection-area').append(newCollection)
  }
}

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
  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readonly')
    const store = transaction.objectStore('currentLogStore')
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        cb(cursor.value)
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
