import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { DateConverter } from './utils/DateConverter.js'
import { Router } from './utils/Router.js'

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
        const router = new Router()
        const searchParams = router.url.searchParams
        const year = Number(searchParams.get('year'))
        const month = Number(searchParams.get('month')) - 1
        const displayFirstOfMonth = searchParams.get('displayFirstOfMonth')

        // dateConverter object, determining the week for the weekly view to show
        let dateToCompare
        let result
        const dailyLogs = cursor.value.$defs['daily-logs']
        let dailyLogResult
        if (searchParams.has('displayFirstOfMonth')) {
          // gets all daily logs with the requested month and year
          result = dailyLogs.filter((log) => {
            // timestamp of milliseconds since Jan 1. 1970 in local time
            const timestamp = Number(log.properties.date.time)
            const date = new Date(timestamp)
            return (date.getFullYear() === year) && (date.getMonth() === month)
          })
          const timestampArr = []
          result.forEach(log => {
            const timestamp = Number(log.properties.date.time)
            timestampArr.push(timestamp)
          })
          const minTimestamp = Math.min(...timestampArr)
          dateToCompare = new DateConverter(minTimestamp)
          dailyLogResult = dailyLogs.filter((log) => {
            const timestamp = log.properties.date.time
            return dateToCompare.oldTimestampInSameWeek(Number(timestamp))
          })
        } else {
          // @TODO get results for navigating from menu
          dateToCompare = new DateConverter(Date.now())
          dailyLogResult = dailyLogs.filter((log) => {
            const timestamp = log.properties.date.time
            return dateToCompare.timestampsInSameWeek(Number(timestamp))
          })
        }
        cb(dailyLogResult, dateToCompare)
      }
    }
  })
}

/**
 * Business/presentation logic routine used to display the columns of the weekly
 * view with the correct anchor tags and entries for each daily log.
 * @param {Object[]} weeklyItems JSON object array containing all the daily
 * logs that should be populated on the weekly view.
 * @param {DateConverter} dateToCompare DateConverter reference containing the
 * date with respect to which we will show the weekly view. For the
 * timestamp of the given DateConverter, we will show the correct date in the anchor
 * tag on each column of the weekly view.
 */
function populateWeeklyView (weeklyItems, dateToCompare) {
  addColumnDates(dateToCompare)
  populateDayColumns(weeklyItems, dateToCompare)
}

function populateDayColumns (weeklyItems, dateToCompare) {
  const week = document.getElementById('weekly-div')
  // create a DateConverter object
  // Use a new instance of Date to fetch the day of the week of the given date
  // we add six and mod by seven to shift the 0-index to start at Monday and end on Sunday.
  const compareDay = (dateToCompare.getDay() + 6) % 7
  weeklyItems.forEach((entry) => {
    // calculate the offset between today's day and the entry's day
    const currentDate = new DateConverter(Number(entry.properties.date.time))
    const offSet = dateToCompare.getDaysFromTimeStamp() - currentDate.getDaysFromTimeStamp()
    const index = compareDay - offSet
    const weeklyItem = document.createElement('weekly-view-item')
    weeklyItem.entry = entry
    const childDiv = week.children[index]
    // console.log(week.children[index])
    // business logic for appending the navigation link to each column
    appendNavLinks(childDiv, currentDate)
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
  anchor.href = '/source/html/daily.html' // @TODO refactor with routing
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
      }
    })
    window.location.href = '/source/html/daily.html'
  }
}

/**
 * Business logic subroutine that adds the date to each
 * column in the weekly view.
 * @param {DateConverter} dateToCompare DateConverter reference containing the
 * date with respect to which we will add dates to each column.
 */
function addColumnDates (dateToCompare) {
  // DateConverter object with timestamp of Monday of same week
  const mondayOfCurrentDate = dateToCompare.getBeginningOfWeek()
  const columns = document.getElementById('weekly-div').getElementsByTagName('div')
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]
    const anchor = column.querySelector('a')
    // get day offset in milliseconds
    const offsetInMillis = i * (24 * 60 * 60 * 1000)
    const currentTimestamp = mondayOfCurrentDate + offsetInMillis
    const currentDate = new DateConverter(currentTimestamp)
    const anchorString = `(${currentDate.getMonth() + 1}.${currentDate.getDate()})`
    anchor.textContent = `${anchor.textContent} ${anchorString}`
  }
}
