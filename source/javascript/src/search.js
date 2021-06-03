import '/node_modules/fuse.js/dist/fuse.js'
import { IndexedDBWrapper } from '/source/javascript/src/indexedDB/IndexedDBWrapper.js'

/**
 * Subroutine used to surface the correct
 * search results from indexedDB.
 * @param {String} pattern String reference containing
 * the pattern to use for fuzzy search
 * @param {String} searchBy String reference containing
 * the item by which we should perform our search
 * @returns {Object[]} Array of JSON objects containing
 * the result of our fuzzy search. The structure of
 * these JSON objects will be dependent on the list from
 * which we performed our fuzzy search
 */
function getLogInfoAsJSON (pattern, searchBy) {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result
    const transaction = db.transaction(['currentLogStore'], 'readonly')
    const store = transaction.objectStore('currentLogStore')

    const req = store.openCursor()
    req.onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        let target
        const options = {
          isCaseSensitive: false,
          includeScore: false,
          shouldSort: true,
          includeMatches: false,
          findAllMatches: false,
          minMatchCharLength: 1,
          location: 0,
          threshold: 0.6,
          distance: 10,
          useExtendedSearch: false,
          ignoreLocation: false,
          ignoreFieldNorm: false
        }
        if (searchBy === 'daily-logs') {
          target = cursor.value.$defs['daily-logs']
          options.keys = [
            'properties.events.description',
            'properties.tasks.description',
            'properties.notes.description',
            'properties.reflection.description'
          ]
        } else {
          target = cursor.value.properties.collections
          options.keys = [
            'name',
            'tasks.description'
          ]
        }
        const fuse = new Fuse(target, options)
        console.log(fuse.search(pattern))
      }
    }
  })
}

const searchButton = document.getElementById('search')
const inputField = document.getElementById('input-area')
const radioDailyLog = document.getElementById('input1')
const radioCollection = document.getElementById('input2')
document.addEventListener('DOMContentLoaded', (event) => {
  searchButton.addEventListener('click', (event) => {
    getLogInfoAsJSON(inputField.value, radioDailyLog.checked ? 'daily-logs' : 'collections')
  })
})
