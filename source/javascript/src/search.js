/* eslint no-undef: "off" */
import '../../../node_modules/fuse.js/dist/fuse.js'
import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'

const searchResults = document.getElementById('search-results')

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
          /**
           * 1. For each daily log:
           *    a. Search by tasks, notes, events, reflection
           *    b. If any results are found:
           *        i. Add a new SearchItem w/ daily log timestamp, relevant tasks,notes,events,reflection
           */
          let taskResults,
            noteResults,
            eventResults,
            reflectionResults
          options.keys = ['description']
          cursor.value.$defs['daily-logs'].forEach((log, index) => {
            taskResults = searchByEntry(pattern, log.properties.tasks, options)
            noteResults = searchByEntry(pattern, log.properties.notes, options)
            eventResults = searchByEntry(pattern, log.properties.events, options)
            reflectionResults = searchByEntry(pattern, log.properties.reflection, options)
            if (taskResults.length > 0 || noteResults.length > 0 || eventResults.length > 0 || reflectionResults.length > 0) {
              const searchItem = document.createElement('search-item')
              const li = document.createElement('li')
              searchItem.entry = {
                time: Number(log.properties.date.time),
                tasks: taskResults,
                notes: noteResults,
                events: eventResults,
                reflection: reflectionResults,
                type: 'daily-log'
              }
              li.appendChild(searchItem)
              searchResults.appendChild(li)
            }
          })
        } else {
          options.keys = ['description']
          let taskResults
          cursor.value.properties.collections.forEach((collection, index) => {
            taskResults = searchByEntry(pattern, collection.tasks, options)
            if (taskResults.length > 0) {
              const searchItem = document.createElement('search-item')
              const li = document.createElement('li')
              searchItem.entry = {
                name: collection.name,
                tasks: taskResults,
                type: 'collection'
              }
              li.appendChild(searchItem)
              searchResults.appendChild(li)
            }
          })
        }
      }
    }
  })
}

/**
 * Search subroutine used to search the given
 * object with the given parameters.
 * @param {String} pattern String object containing
 * the pattern to use to determine matches in our
 * fuzzy search
 * @param {Object[]} target Array of JSON objects
 * from which we should perform our fuzzy search
 * @param {Object} options JSON object containing the
 * options with which to perform a fuzzy search.
 * @returns {Object[]} Array of JSON objects containing
 * all of the relevant search results from the list target
 */
function searchByEntry (pattern, target, options) {
  return new Fuse(target, options).search(pattern)
}

const searchButton = document.getElementById('search')
const inputField = document.getElementById('input-area')
const radioDailyLog = document.getElementById('input1')
const radioCollection = document.getElementById('input2')
const resultContainer = document.getElementById('result-container')

document.addEventListener('DOMContentLoaded', (event) => {
  searchButton.addEventListener('click', (event) => {
    const resultList = document.getElementById('search-results')
    resultList.innerHTML = ''
    getLogInfoAsJSON(inputField.value, radioDailyLog.checked ? 'daily-logs' : 'collections')
    resultContainer.style.visibility = 'visible'
  })
})
