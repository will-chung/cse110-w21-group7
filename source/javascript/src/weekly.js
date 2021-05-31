import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { DateConverter } from './utils/DateConverter.js'

const weekly = document.getElementById('weekly-div')
const monday = document.getElementById('Monday')
const tuesday = document.getElementById('Tuesday')
const wednesday = document.getElementById('Wednesday')
const thursday = document.getElementById('Thursday')
const friday = document.getElementById('Friday')
const saturday = document.getElementById('Saturday')
const sunday = document.getElementById('Sunday')

/**
 * Performs an AJAX call for JSON type response containing
 * the daily log information corresponding to the given date.
 * If there is no daily log information for the given date,
 * a new daily log is created if the date is the present day.
 * @author Noah Teshima <nteshima@ucsd.edu>, Zhiyuan Zhang <zhz018@ucsd.edu>
 * @throws Error object if date reference is null, undefined. Otherwise,
 * an error is thrown if the given date is not the present day and failed
 * to retrieve log info for given day.
 * @returns JSON type response, containing the information needed to
 * initialize the daily log.
 */
function getLogInfoAsJSON (cb) {
  // Do we need to open a new db?
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result
    const transaction = db.transaction(['currentLogStore'], 'readonly') // mode should be readonly
    const store = transaction.objectStore('currentLogStore')
    // this gets all entries and store them as an array, pass in a key, what's the key?
    const getReq = store.getAll()

    getReq.onsuccess = (event) => {
      const allEntries = getReq.result
    }
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      // this cursor hold on to the event, we have fetched the data in the db
      if (cursor) {
        // current date
        const current = new DateConverter(Date.now())
        const dailyLogs = cursor.value.$defs['daily-logs']
        const result = dailyLogs.filter((log) => {
          const timestamp = log.properties.date.time
          return current.timestampsInSameWeek(Number(timestamp))
        })

        console.log(result)
        cb(result)
      }
    }
  })
}

function populateWeeklyView (weeklyItems) {
  addColumnDates()
  populateDayColumns(weeklyItems)
}

function populateDayColumns (weeklyItems) {
  const week = document.getElementById('weekly-div')
  // create a DateConverter object
  const current = new DateConverter(Date.now())
  // Use a new instance of Date to fetch the day of the week of today
  const today = new DateConverter()
  let todayDays = today.getDay()
  weeklyItems.forEach((entry) => {
    // calculate the offset between today's day and the entry's day
    const offSet = current.getDaysFromTimeStamp(Date.now()) - current.getDaysFromTimeStamp(entry.properties.date.time)
    const currentDay = new DateConverter(Number(entry.properties.date.time))
    // apply the offset to get the index
    if(todayDays === 0){
      todayDays = 7
    }
    const index = todayDays - offSet
    const weeklyItem = document.createElement('weekly-view-item')
    weeklyItem.entry = entry
    const childDiv = week.children[index]
    // business logic for appending the navigation link to each column
    appendNavLinks(childDiv, currentDay)
    childDiv.appendChild(weeklyItem)
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(populateWeeklyView)
})

/**
 * @author Katherine Baker <klbaker@ucsd.edu> and Yuzi Lyu <>
 * @param {HTMLElement} targetElement div element that is a direct
 * child of the div with identifier #weekly-div. From this element, we
 * are able to
 * @param {Date} date Date reference containing the date to append to
 * the header for the current column on the monthly/weekly view.
 */
function appendNavLinks (targetElement, date) {
  const anchor = targetElement.querySelector('a')
  anchor.dataset.unixTimestamp = date.getTime()
  anchor.href = '/source/html/daily.html'
  // adjusts current_log in DB
  anchor.onclick = function (event) {
    event.preventDefault()
    const wrapper = new IndexedDBWrapper('experimentalDB', 1)
    const that = event

    wrapper.transaction((event) => {
      const db = event.target.result
      const store = db.transaction(['currentLogStore'], 'readwrite').objectStore('currentLogStore')

      const req = store.openCursor()
      req.onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
          cursor.value.current_log = that.target.dataset.unixTimestamp
          cursor.update(cursor.value)
        }
        console.log(cursor.value)
      }
    })
    window.location.href = '/source/html/daily.html'
  }
}

/**
 * Business logic subroutine that adds the date to each
 * column in the weekly view.
 */
function addColumnDates () {
  const currentDate = new DateConverter()

  // DateConverter object with timestamp of Monday of same week
  const mondayOfCurrentDate = currentDate.getBeginningOfWeek()
  const columns = document.getElementById('weekly-div').getElementsByTagName('div')
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]
    const anchor = column.querySelector('a')
    // get day offset in milliseconds
    const offsetInMillis = i * (24 * 60 * 60 * 1000)
    const currentTimestamp = mondayOfCurrentDate + offsetInMillis
    // console.log('index ' + i + " timestamp: " + currentTimestamp)
    const currentDate = new DateConverter(currentTimestamp)
    const anchorString = `(${currentDate.getMonth() + 1}.${currentDate.getDate()})`
    anchor.textContent = `${anchor.textContent} ${anchorString}`
  }
}
