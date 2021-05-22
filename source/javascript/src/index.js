import { DateConverter } from './utils/DateConverter.js'
import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'

document.addEventListener('DOMContentLoaded', (event) => {
  const addDailyLog = document.querySelector("button[id='rapid-log'] > a")

  addDailyLog.onclick = function (event) {
    // Allows us to make write transactions before navigating
    event.preventDefault()
    const wrapper = new IndexedDBWrapper('experimentalDB', 1)
    wrapper.transaction((event) => {
      const db = event.target.result

      const transaction = db.transaction(['currentLogStore'], 'readwrite')
      // Event triggered when transaction is successfully opened
      transaction.oncomplete = (event) => {
        console.log('Transaction completed.')
      }

      transaction.onerror = (event) => {
        console.log('Transaction error.')
      }

      transaction.onsuccess = (event) => {
        console.log('Transaction succeeded.')
      }

      const store = transaction.objectStore('currentLogStore')

      const req = store.openCursor()
      // Fires when cursor is successfully opened.
      req.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          console.log(cursor.value.current_log)
          cursor.value.current_log = String(Date.now())
          cursor.update(cursor.value)
        } else {
          // This block of execution occurs if we have no entries set up under
          // object storage (i.e. new user who clicked on 'Add+')
          const tempObjectStore = db.transaction(['currentLogStore'], 'readwrite')
            .objectStore('currentLogStore')
          const req = new XMLHttpRequest()
          req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
              const response = JSON.parse(req.responseText)
              const tempStore = db.transaction('currentLogStore', 'readwrite').objectStore('currentLogStore')
              response.current_log = String(Date.now())
              tempStore.put(response)
            }
          }
          req.open('GET', '../models/schema.json')
          req.send()
          console.log('Made new entry!')
        }
        // Unsuspend navigation
        window.location.href = 'daily.html'
      }
    })
  }
})
