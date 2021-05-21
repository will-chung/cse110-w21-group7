import {DateConverter as DateConverter} from './utils/DateConverter.js'

let dailyLogs = [
  {
    "type": "object",
    "required": [ "date", "description" ],
    "properties": {
      "date": {
        "type": "string",
        "time": "1621556127975",
        "description": "The date of the event."
      },
      "events": [
        {
          "description": "description for event one",
          "logType": "event",
          "time": "1621427132543"
        },
        {
          "description": "description for event two",
          "logType": "event",
          "time": "1621470343054"
        }
      ],
      "tasks": [
          {
            "description": "description for task one",
            "logType": "task",
            "finished": true
          },
          {
            "description": "description for task two",
            "logType": "task",
            "finished": false
          }
      ],
      "notes": [
        {
          "description": "description for note one",
          "logType": "note"
        },
        {
          "description": "description for note two",
          "logType": "note"
        }
    ],
      "mood": {
        "type": "number",
        "multipleOf": 1,
        "minimum": 0,
        "exclusiveMaximum": 100,
        "description": "Daily mood on a range of 0-99."
      }
    }
  },
  {
    "type": "object",
    "required": [ "date", "description" ],
    "properties": {
      "date": {
        "type": "string",
        "time": "16214434693434",
        "description": "The date of the event."
      },
      "events": [
        {
          "description": "another description for event one",
          "logType": "event",
          "time": "1621427132543"
        },
        {
          "description": "another description for event two",
          "logType": "event",
          "time": "1621470343054"
        }
      ],
      "tasks": [
          {
            "description": "another description for task one",
            "logType": "task",
            "finished": true
          },
          {
            "description": "another description for task two",
            "logType": "task",
            "finished": false
          }
      ],
      "notes": [
        {
          "description": "another description for note one",
          "logType": "note"
        },
        {
          "description": "another description for note two",
          "logType": "note"
        }
    ],
      "mood": {
        "type": "number",
        "multipleOf": 1,
        "minimum": 0,
        "exclusiveMaximum": 100,
        "description": "Daily mood on a range of 0-99."
      }
    }
  }
]

document.addEventListener('DOMContentLoaded', (event) => {

  let addDailyLog = document.querySelector("button[id='rapid-log'] > a");

  addDailyLog.onclick = function(event) {
    event.preventDefault()
    initIndexedDB("experimentalDB5", 1, () => {})
  }
})

/**
 * Function to intiialize indexedDB and run a callback on
 * transactions with daily log storage object.
 * @param {String} name String contining the name of the database
 * indexedDB should open
 * @param {Number} version Version number containing the version 
 * that indexedDB should open
 */
function initIndexedDB(name="experimentalDB", version=1, cb) {
  let request = window.indexedDB.open(name, version)
  // Event triggered if opening the DB doesn't work
  request.onerror = function(event) {
    console.log("IndexedDB not working")
  }

  request.onupgradeneeded = function(event) {
    // Save the IDBDatabase interface
    let db = event.target.result
    // Create an objectStore for this database
    if (!db.objectStoreNames.contains('dailyLogsStore')) {
      let objectStore
      // create object store in our DB
      objectStore = db.createObjectStore("dailyLogsStore", { keyPath: "properties.date.time"})
      objectStore.createIndex("event", "properties.events", { unique: false })

      
      
      objectStore.transaction.oncomplete = (event) => {
        let tempObjectStore = db.transaction(['dailyLogsStore'], 'readwrite')
                                .objectStore('dailyLogsStore')
        tempObjectStore.transaction.oncomplete = (event) => {
          console.log('Added data to object store.')
        }
        // Storing mock daily logs data
        dailyLogs.forEach((user) => {
          tempObjectStore.add(user)
          console.log(`Added ${user}`)
        })
      }
      // Make sure objectStore has been completed using transaction.oncomplete
    } else {
      // open existing object store
      console.log('Object store already created!')
    }
  };


  // Event triggered if opening the DB works
  request.onsuccess = function(event) {
    console.log("IndexedDB working")
    let db = request.result

    let transaction = db.transaction(['dailyLogsStore'], 'readwrite')
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

    let store = transaction.objectStore('dailyLogsStore')

    // let logRequest = store.get("1621445109502")
    // logRequest.onsuccess = (event) =>{
    // }
    

    store.openCursor().onsuccess = (event) => {
      let cursor = event.target.result
      let converter = new DateConverter()
      const currentDay = converter.getDaysFromTimeStamp()
      if (cursor) {
        converter.timestamp = Number(cursor.value.properties.date.time)
        const aux = converter.getDaysFromTimeStamp()
        if(aux === currentDay) {
          console.log('Success!')
        }        
        cursor.continue()
      }
    }

    // let ind = store.index('entry')
    // ind.get(1).onsuccess = (event) => {
    //   console.log("Timestamp is: " + event.target.result.timestamp)
    // }

  }
}


