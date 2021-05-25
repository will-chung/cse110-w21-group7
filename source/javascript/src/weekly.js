import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { DateConverter } from './utils/DateConverter.js'

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
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readonly')
    const store = transaction.objectStore('currentLogStore')
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        // current date
        const current = new DateConverter()
        const dailyLogs = cursor.value.$defs['daily-logs']
        const result = dailyLogs.filter((log) => {
          const timestamp = log.properties.date.time
          return current.timestampsInSameWeek(Number(timestamp))
        })
        console.log(result)
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(() => {})
})
