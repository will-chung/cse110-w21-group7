import { wrapper } from './components/CollectionItem.js'
import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { DateConverter } from './utils/DateConverter.js'
import { Router, ROUTES } from './utils/Router.js'
import { Tag } from './components/tag.js'

const collapse = document.getElementById('collapse')
const quote = document.getElementById('reflection')
const text = document.getElementById('input-area')
const date = document.getElementById('date-input')
const time = document.getElementById('time-input')
const saveBtn = document.getElementById('cb2')
const realCanBtn = document.getElementById('cancel')
const cancelBtn = document.getElementById('cb1')
const refRadio = document.getElementById('input1')
const eventRadio = document.getElementById('input2')
const taskRadio = document.getElementById('input3')
const noteRadio = document.getElementById('input4')
const radioContainer = document.getElementsByClassName('container')[0]
const realSavBtn = document.getElementById('save')
const tmButton = document.getElementById('tomorrow')
const ytButton = document.getElementById('yesterday')
const tagOptions = document.querySelector('.tag-options')

cancelBtn.addEventListener('click', () => {
  // TODO: implement hide functionality
  text.value = ''
})

// TODO
radioContainer.addEventListener('change', () => {
  resetEverything()
  if (refRadio.checked) {
    text.style.visibility = 'visible'
    saveBtn.style.display = 'inline-block'
    cancelBtn.style.display = 'inline-block'
  } else if (eventRadio.checked) {
    time.style.display = 'inline-block'
    time.style.visibility = 'visible'
  } else if (taskRadio.checked) {
    date.style.visibility = 'visible'
    time.style.display = 'none'
    // we need to remove the eventListener afterwards
  } else if (noteRadio.checked) {
    text.style.visibility = 'visible'
    saveBtn.style.display = 'inline-block'
    cancelBtn.style.display = 'inline-block'
  }
})

/**
 * Onclick of the "Add tag" button will trigger this event and add
 * the collection tag to the daily log
 */
tagOptions.addEventListener('click', (event) => {
  const collectionName = event.target.textContent
  console.log('clicked!')
  document.querySelector('.tags').append(new Tag(collectionName))
  addCollectionTag(collectionName)
})

/**
 * Adds a collection tag to the user's daily log
 * @param {String} collectionName Collection that will be added as a
 * tag to the daily log
 */
function addCollectionTag (collectionName) {
  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readwrite')
    const objectStore = transaction.objectStore('currentLogStore')
    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result

      if (cursor) {
        const json = cursor.value
        const collections = json.properties.collections
        const router = new Router()
        const params = router.url.searchParams
        const timestamp = Number(params.get('timestamp'))

        collections.forEach(collection => {
          if (collection.name === collectionName) {
            collection.logs.push(timestamp)
          }
        })

        cursor.update(json)
      }
    }
  })

  // remove tag option
  const tagOptions = document.querySelector('.tag-options').childNodes
  tagOptions.forEach(node => {
    if (node.textContent === collectionName) {
      node.remove()
    }
  })
}

/**
 * Adds tasks, notes, events, and reflections to the daily log. If the entry is
 * empty, then the bullet journal alerts the user that they must write 
 * something for that entry
 */
function newElement () {
  const inputValue = document.getElementById('input-area').value
  if (inputValue.length === 0) {
    alert('You must write something!')
    return
  }
  const li = document.createElement('li')
  const logItem = document.createElement('log-item')
  const itemEntry = {}
  // entry specifies what log entry is falls under (for data purposes)
  let entry = ''

  // Update log type according to which item was checked
  if (taskRadio.checked) {
    itemEntry.logType = 'task'
    itemEntry.finished = false
    entry = 'tasks'
  } else if (noteRadio.checked) {
    itemEntry.logType = 'note'
    entry = 'notes'
  } else if (eventRadio.checked) {
    itemEntry.logType = 'event'
    entry = 'events'
    // parse the number of hours
    const hours = Number(time.value.substring(0, 2))
    // parse the number of minutes
    const minutes = Number(time.value.substring(3))
    // update UNIX timestamp with hours and minutes (GMT time)
    const timestamp = Date.parse(date.value) +
                (hours * 60 * 60 * 1000) +
                (minutes * 60 * 1000) +
                (new Date().getTimezoneOffset() * 60 * 1000)
    // @TODO
    itemEntry.time = timestamp
  } else {
    itemEntry.logType = 'reflection'
    entry = 'reflection'
  }
  itemEntry.description = inputValue
  logItem.itemEntry = itemEntry
  li.appendChild(logItem)
  logItem.setHoverListeners()
  document.getElementById('myUL').appendChild(li)
  document.getElementById('input-area').value = ''

  // Call updateElement to save the new tasks
  updateElement(itemEntry, entry)
}

function resetEverything () {
  date.style.visibility = 'hidden'
  date.value = ''
  text.value = ''
  text.style.visibility = 'hidden'
  saveBtn.style.display = 'none'
  cancelBtn.style.display = 'none'
  time.value = ''
  time.style.visibility = 'hidden'
}

/**
 * Adds tasks, notes, and events in the daily log.
 * These changes should be saved and reflected the next time
 * the user opens the daily log.
 * @param {Object} logEntry Log entry and associated description
 * to be added to the schema
 * @param {String} entry Category that logEntry should go under
 * for the schema (notes/tasks/events/reflection)
 */
function updateElement (logEntry, entry) {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  // Created when the IDB makes a transaction
  wrapper.transaction((event) => {
    // Create transaction for the updated log store
    const db = event.target.result
    const transaction = db.transaction(['currentLogStore'], 'readwrite')
    const store = transaction.objectStore('currentLogStore')

    // Open the object store
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        // Get the cursor value and push the log item entry onto the file
        const router = new Router()
        const searchParams = router.url.searchParams
        if (searchParams.has('timestamp')) {
          const timestamp = Number(searchParams.get('timestamp'))
          const dateConverter = new DateConverter(timestamp)
          cursor.value.$defs['daily-logs'].forEach((log, index) => {
            if (dateConverter.equals(Number(log.properties.date.time))) {
              cursor.value.$defs['daily-logs'][index].properties[entry].push(logEntry)
            }
          })
        }
        cursor.update(cursor.value)
      }
    }
  })
}

/**
 * Performs an AJAX call for JSON type response containing
 * the daily log information corresponding to the given date.
 * If there is no daily log information for the given date,
 * a new daily log is created if the date is the present day.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @author Brett Herbst <bherbst@ucsd.edu>
 * @param {String} quote String reference containing resulting quote from
 * ReST API call. We use this quote for new daily log entries
 * @throws Error object if date reference is null, undefined. Otherwise,
 * an error is thrown if
 * to retrieve log info for given day. the given date is not the present day and failed
 * @returns JSON type response, containing the information needed to
 * initialize the daily log.
 */
function getLogInfoAsJSON (cb, quote) {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result

    const store = db.transaction(['currentLogStore'], 'readwrite')
      .objectStore('currentLogStore')
    store.openCursor().onsuccess = async function (event) {
      const cursor = event.target.result
      if (cursor) {
        const router = new Router()
        const searchParams = router.url.searchParams
        if (searchParams.has('timestamp')) {
          const timestamp = Number(searchParams.get('timestamp'))
          const dateConverter = new DateConverter(timestamp)
          // console.log(cursor.value)
          let match = false
          cursor.value.$defs['daily-logs'].forEach((log, index) => {
            if (dateConverter.equals(Number(log.properties.date.time))) {
              match = true
              cb.bind(this)
              cb(cursor.value.$defs['daily-logs'][index], cursor.value)
            }
          })
          // if there is no match for the given day, we create a daily log
          if (!match) {
            const dlLength = cursor.value.$defs['daily-logs']
            const appendObj = {
              type: 'object',
              required: ['date', 'description'],
              properties: {
                date: {
                  type: 'string',
                  time: timestamp,
                  description: 'The date of the event.'
                },
                events: [],
                tasks: [],
                notes: [],
                reflection: [{
                  description: quote,
                  logType: 'reflection'
                }],
                mood: {
                  type: 'number',
                  multipleOf: 1,
                  minimum: 0,
                  exclusiveMaximum: 100,
                  value: 50,
                  description: 'Daily mood on a range of 0-99.'
                }
              }
            }
            cursor.value.$defs['daily-logs'].push(appendObj)
            cursor.update(cursor.value)
            cb.bind(this)
            cb(appendObj, cursor.value)
          }
        }
      }
    }
  })
}

/* Business logic */

/**
 * Business logic subroutine for adding individual entries (tasks/notes/events)
 * to the comprehensive view on the daily log
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Object} log JSON object formatted based on the schema for
 * a single daily log
 */
function setEntries (log) {
  function populateTypeOfEntry (entries) {
    entries.forEach((entry, index) => {
      const li = document.createElement('li')
      const logItem = document.createElement('log-item')
      entry.editable = true
      logItem.itemEntry = entry

      li.appendChild(logItem)
      logItem.setHoverListeners()
      document.getElementById('myUL').appendChild(li)
    })
  }

  /* Populate entries in daily log */
  populateTypeOfEntry(log.properties.reflection)
  populateTypeOfEntry(log.properties.events)
  populateTypeOfEntry(log.properties.tasks)
  populateTypeOfEntry(log.properties.notes)
}

/**
 * Business logic subroutine for updating the reflection section (mood slider)
 *
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Object} log JSON object formatted based on the schema for
 * a single daily log
 */
function setReflection (log) {
  const reflection = log.properties.mood
  const reflectionItem = document.querySelector('reflection-item')
  reflectionItem.entry = reflection
}

/**
 * Business logic subroutine for adding the date of the daily log to the title
 * of the page.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Object} log JSON object formatted based on the schema for
 * a single daily log
 */
function setDate (log) {
  const time = Number(log.properties.date.time)
  const date = getDateFromUNIXTimestamp(time)

  const dateElement = document.querySelector('#title > .date')
  dateElement.innerText = date.toLocaleDateString()
}

/**
 * Business logic subroutine for adding collection tags to the daily log.
 * @param {Object} json JSON object for the collection tag
 */
function setTags (json) {
  const collections = json.properties.collections
  const router = new Router()
  const params = router.url.searchParams
  const dateConverter = new DateConverter(Number(params.get('timestamp')))
  const currentLog = dateConverter.timestamp

  const containsLog = (collection) => {
    return !(collection.find((log) => {
      return dateConverter.equals(new DateConverter(log))
    }) === undefined)
  }

  collections.forEach(collection => {
    if (containsLog(collection.logs)) {
      document.querySelector('.tags').append(new Tag(collection.name))
    }
  })
}

/**
 * Business logic subroutine for adding the collection tag options
 * for the "Add tag" button. Only give collection options that are
 * not already tagged for the daily log.
 * @param {Object} json JSON object for the add collection tag options
 */
function setTagOptions (json) {
  const collections = json.properties.collections
  const router = new Router()
  const params = router.url.searchParams
  const dateConverter = new DateConverter(Number(params.get('timestamp')))
  const currentLog = dateConverter.timestamp

  const tagOptions = document.querySelector('.tag-options')
  tagOptions.innerHTML = ''

  const containsLog = (collection) => {
    return !(collection.find((log) => {
      return dateConverter.equals(new DateConverter(log))
    }) === undefined)
  }

  collections.forEach(collection => {
    // only add option if daily log doesn't already belong to the collection
    if (!containsLog(collection.logs)) {
      const anchor = document.createElement('a')
      anchor.setAttribute('href', '#')
      anchor.textContent = collection.name
      tagOptions.append(anchor)
    }
  })
}

/**
 * Business logic callback function containing all the needed
 * subroutines for initializing the daily log
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param json Head of the JSON stored in database
 */
function populateDailyLog (response, json) {
  /* TODO: replace response with schema for single daily log
  (see https://github.com/cse110-w21-group7/cse110-SP21-group7/issues/161
    and https://github.com/cse110-w21-group7/cse110-SP21-group7/issues/162)
  */
  if (response) {
    setDate(response)
    setEntries(response)
    setReflection(response)
  }
  setTags(json)
  setTagOptions(json)
}

/**
 * Function to get the date from a given UNIX timestamp.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Number} timestamp Number object representing our
 * UNIX timestamp
 * @returns {DateConverter} DateConverter object containing the date contained
 * in the UNIX timestamp.
 */
function getDateFromUNIXTimestamp (timestamp) {
  return new DateConverter(timestamp)
}

// TODO: not sure what this one does
document.addEventListener('DOMContentLoaded', (event) => {
  saveBtn.style.display = 'none'
  cancelBtn.style.display = 'none'
  saveBtn.addEventListener('click', (event) => {
    event.preventDefault()
    newElement()
  })
  collapse.addEventListener('click', () => {
    if (quote.style.display === '' || quote.style.display === 'none') {
      collapse.removeChild(collapse.childNodes[1])
      const downArrow = document.createElement('i')
      downArrow.className = 'fa fa-chevron-up fa-lg'
      collapse.appendChild(downArrow)
      quote.style.display = 'block'
    } else {
      collapse.removeChild(collapse.childNodes[1])
      const upArrow = document.createElement('i')
      upArrow.className = 'fa fa-chevron-down fa-lg'
      collapse.appendChild(upArrow)
      quote.style.display = 'none'
    }
  })
  date.addEventListener('change', () => {
    text.style.visibility = 'visible'
    saveBtn.style.display = 'inline-block'
    cancelBtn.style.display = 'inline-block'
  })
  time.addEventListener('change', () => {
    date.style.visibility = 'visible'
  })

  fetch('https://api.quotable.io/random')
    .then((result) => result.json())
    .then((jsonResult) => {
      return `${jsonResult.content} —${jsonResult.author}`
    })
    .then((quote) => {
      getLogInfoAsJSON(populateDailyLog, quote)
    })
})

/**
 * Routes the user from the current daily log they are on
 * to yesterday's daily log
 */
const yesterdayTodayNav = (yesterday = true) => {
  const router = new Router()
  const searchParams = router.url.searchParams
  if (searchParams.has('timestamp')) {
    const timestamp = Number(searchParams.get('timestamp'))
    searchParams.set('timestamp', yesterday ? timestamp - 86400000 : timestamp + 86400000)
    router.navigate()
  }
}

/**
 * Business logic for tommorow Button
 * @author Brett Herbst <bherbst@ucsd.edu>
 * @author Noah Teshima <nteshima@ucsd.edu>
 * Modeled after index.js Rapid Log button
 */
tmButton.addEventListener('click', () => {
  yesterdayTodayNav(false)
})

/**
 * Business logic for yesterday Button
 * @author Brett Herbst <bherbst@ucsd.edu>
 * @author Noah Teshima <nteshima@ucsd.edu>
 * Modeled after index.js Rapid Log button
 */
ytButton.addEventListener('click', () => {
  yesterdayTodayNav(true)
})
