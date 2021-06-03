import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { DateConverter } from './utils/DateConverter.js'

const collapse = document.getElementById('collapse')
const quote = document.getElementById('reflection')
const text = document.getElementById('input-area')
const date = document.getElementById('date-input')
const time = document.getElementById('time-input')
const saveBtn = document.getElementById('cb1')
const realCanBtn = document.getElementById('cancel')
const cancelBtn = document.getElementById('cb2')
const refRadio = document.getElementById('input1')
const eventRadio = document.getElementById('input2')
const taskRadio = document.getElementById('input3')
const noteRadio = document.getElementById('input4')
const radioContainer = document.getElementsByClassName('container')[0]
const realSavBtn = document.getElementById('save')
const tmButton = document.getElementById('tomorrow')
const ytButton = document.getElementById('yesterday')

// cancelBtn.addEventListener('click', () => {
//   // TODO: implement hide functionality
//   hideEverything()
// })
// saveBtn.addEventListener('click', () => {
//   realSavBtn.click()
// })
// cancelBtn.addEventListener('click', () => {
//   realCanBtn.click()
// })

/*
 * This onclick toggles the display style of the quote to none
 * TODO: Collapse the whole div, not just the quote
 * Resource: https://codepen.io/Mdade89/pen/JKkYGq
 * the link above provides a collapsible text box
 */
// document.addEventListener('DOMContentLoaded', () => {
//   saveBtn.style.visibility = 'hidden'
//   saveBtn.addEventListener('click', (event) => {
//     event.preventDefault()
//     newElement()
//   })
//   cancelBtn.style.visibility = 'hidden'
//   text.type = 'hidden'
//   date.type = 'hidden'
//   time.type = 'hidden'
// })

radioContainer.addEventListener('change', () => {
  if (refRadio.checked) {
    text.type = 'text'
    date.type = 'hidden'
    time.type = 'hidden'
    saveBtn.style.visibility = 'visible'
    cancelBtn.style.visibility = 'visible'
  } else if (eventRadio.checked) {
    // reset input field start
    saveBtn.style.visibility = 'hidden'
    cancelBtn.style.visibility = 'hidden'
    text.type = 'hidden'
    text.value = ''
    date.value = ''
    time.value = ''
    // reset input field done
    date.type = 'date'
    date.addEventListener('change', () => {
      time.type = 'time'
    })
    time.addEventListener('change', () => {
      text.type = 'text'
      saveBtn.style.visibility = 'visible'
      cancelBtn.style.visibility = 'visible'
    })
  } else if (taskRadio.checked) {
    // reset input field start
    date.value = ''
    text.value = ''
    saveBtn.style.visibility = 'hidden'
    cancelBtn.style.visibility = 'hidden'
    text.type = 'hidden'
    time.type = 'hidden'
    // reset input field done
    date.type = 'date'
    date.addEventListener('change', () => {
      text.type = 'text'
      time.type = 'hidden'
      saveBtn.style.visibility = 'visible'
      cancelBtn.style.visibility = 'visible'
    })
  } else if (noteRadio.checked) {
    date.type = 'hidden'
    text.value = ''
    saveBtn.style.visibility = 'hidden'
    cancelBtn.style.visibility = 'hidden'
    text.type = 'hidden'
    time.type = 'hidden'
    text.type = 'text'
    saveBtn.style.visibility = 'visible'
    cancelBtn.style.visibility = 'visible'
  } else {
    text.type = 'hidden'
    date.type = 'hidden'
    time.type = 'hidden'
  }
})

collapse.addEventListener('click', () => {
  if (quote.style.display === 'none') {
    collapse.removeChild(collapse.childNodes[0])
    const downArrow = document.createElement('i')
    downArrow.className = 'fa fa-chevron-up fa-lg'
    collapse.appendChild(downArrow)
    quote.style.display = 'block'
  } else {
    collapse.removeChild(collapse.childNodes[0])
    const upArrow = document.createElement('i')
    upArrow.className = 'fa fa-chevron-down fa-lg'
    collapse.appendChild(upArrow)
    quote.style.display = 'none'
  }
})

/**
 * Adds tasks, notes, and events to the daily log. If the entry is evmpty,
 * then the bullet journal alerts the user that they must write something
 * for that task/note/event.
 *
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
  if (taskRadio.checked) {
    itemEntry.logType = 'task'
    itemEntry.finished = false
  } else if (noteRadio.checked) {
    itemEntry.logType = 'note'
  } else if (eventRadio.checked) {
    itemEntry.logType = 'event'
    // parse the number of hours
    const hours = Number(time.value.substring(0, 2))
    // parse the number of minutes
    const minutes = Number(time.value.substring(3))
    // update UNIX timestamp with hours and minutes
    const timestamp = Date.parse(date.value) +
                (hours * 60 * 60 * 1000) +
                (minutes * 60 * 1000)
    const dateConverter = new DateConverter(timestamp)

    // @TODO
    itemEntry.time = dateConverter.timestamp
  } else {
    itemEntry.logType = 'reflection'
  }
  itemEntry.description = inputValue

  logItem.itemEntry = itemEntry
  li.appendChild(logItem)
  document.getElementById('myUL').appendChild(li)
  document.getElementById('input-area').value = ''
}

function hideEverything () {
  date.type = 'hidden'
  text.value = ''
  // saveBtn.style.display = 'none'
  // cancelBtn.style.display = 'none'
  text.type = 'hidden'
  time.type = 'hidden'
}

/**
 * Performs an AJAX call for JSON type response containing
 * the daily log information corresponding to the given date.
 * If there is no daily log information for the given date,
 * a new daily log is created if the date is the present day.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @author Brett Herbst <bherbst@ucsd.edu>
 * @throws Error object if date reference is null, undefined. Otherwise,
 * an error is thrown if
 * to retrieve log info for given day. the given date is not the present day and failed
 * @returns JSON type response, containing the information needed to
 * initialize the daily log.
 */
function getLogInfoAsJSON (cb) {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result

    const store = db.transaction(['currentLogStore'], 'readwrite')
      .objectStore('currentLogStore')
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        const dateConverter = new DateConverter(Number(cursor.value.current_log))
        console.log(cursor.value)
        let match = false
        let lenArr = 0
        cursor.value.$defs['daily-logs'].forEach((log, index) => {
          if (dateConverter.equals(Number(log.properties.date.time))) {
            match = true
            cb.bind(this)
            cb(cursor.value.$defs['daily-logs'][index])
          }
          lenArr = index
        })
        if (!match) {
          const dlLength = cursor.value.$defs['daily-logs']
          const appendObj = {
            type: 'object',
            required: ['date', 'description'],
            properties: {
              date: {
                type: 'string',
                time: cursor.value.current_log,
                description: 'The date of the event.'
              },
              events: [],
              tasks: [],
              notes: [],
              reflection: [],
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
          cb.bind(this)
          cb(cursor.value.$defs['daily-logs'][lenArr + 1])
          cursor.update(cursor.value)
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
      document.getElementById('myUL').appendChild(li)
    })
  }

  /* make tasks */
  populateTypeOfEntry(log.properties.tasks)
  populateTypeOfEntry(log.properties.notes)
  populateTypeOfEntry(log.properties.events)
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
 * Business logic callback function containing all the needed
 * subroutines for initializing the daily log
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
function populateDailyLog (response) {
  /* TODO: replace response with schema for single daily log
  (see https://github.com/cse110-w21-group7/cse110-SP21-group7/issues/161
    and https://github.com/cse110-w21-group7/cse110-SP21-group7/issues/162)
  */
  setDate(response)
  setEntries(response)
  setReflection(response)
}

/**
 * Function to get the date from a given UNIX timestamp.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Number} timestamp Number object representing our
 * UNIX timestamp
 * @returns {Date} Date object containing the date contained
 * in the UNIX timestamp.
 */
function getDateFromUNIXTimestamp (timestamp) {
  return new Date(timestamp)
}

document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(populateDailyLog)
})

const zoom = document.getElementById('pretty')
const custZoom = document.getElementById('button1')

custZoom.addEventListener('click', function () {
  zoom.click()
})

/**
 * Business logic for tommorow Button
 * @author Brett Herbst <bherbst@ucsd.edu>
 * Modeled after index.js Rapid Log button
 */
tmButton.addEventListener('click', () => {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)
  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readwrite')

    const store = transaction.objectStore('currentLogStore')

    const req = store.openCursor()
    // Fires when cursor is successfully opened.
    req.onsuccess = function (e) {
      const cursor = e.target.result
      if (cursor) {
        //Iterates current_log forward 1 day
        cursor.value.current_log = (parseInt(cursor.value.current_log) + 86400000).toString()
        cursor.update(cursor.value)
      }
      getLogInfoAsJSON(populateDailyLog)
    }
  })
})

/**
 * Business logic for yesterday Button
 * @author Brett Herbst <bherbst@ucsd.edu>
 * Modeled after index.js Rapid Log button
 */
ytButton.addEventListener('click', () => {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)
  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readwrite')
    // Event triggered when transaction is successfully opened

    const store = transaction.objectStore('currentLogStore')

    const req = store.openCursor()
    // Fires when cursor is successfully opened.
    req.onsuccess = function (e) {
      const cursor = e.target.result
      if (cursor) {
        //Iterates current_log back 1 day
        cursor.value.current_log = (parseInt(cursor.value.current_log) - 86400000).toString()
        cursor.update(cursor.value)
      }
      getLogInfoAsJSON(populateDailyLog)
    }
  })
})
