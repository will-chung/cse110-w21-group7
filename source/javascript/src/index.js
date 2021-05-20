// (function () {
//   const $body = document.body
//   const $menuTrigger = $body.getElementsByClassName('menu-trigger')[0]

//   if (typeof $menuTrigger !== 'undefined') {
//     $menuTrigger.addEventListener('click', function () {
//       $body.className = ($body.className === 'menu-active') ? '' : 'menu-active'
//     })
//   }
// }).call(this)


let request = window.indexedDB.open('newDB10', 4)

let syntheticData = [
  {"timestamp": 1000000, "entry": 0},
  {"timestamp": 1000001, "entry": 1},
  {"timestamp": 1000002, "entry": 2},
  {"timestamp": 1000003, "entry": 2},
]

// Event triggered if opening the DB doesn't work
request.onerror = function(event) {
  console.log("IndexedDB not working")
}

request.onupgradeneeded = function(event) {
  // Save the IDBDatabase interface
  let db = event.target.result
  // Create an objectStore for this database
  if (!db.objectStoreNames.contains('newObjectStoreName')) {
    let objectStore
    // create object store in our DB
    objectStore = db.createObjectStore("newObjectStoreName", { keyPath: "timestamp" })
    objectStore.createIndex('entry', 'entry', { unique: false })
    objectStore.transaction.oncomplete = (event) => {
      let tempObjectStore = db.transaction(['newObjectStoreName'], 'readwrite')
                              .objectStore('newObjectStoreName')
      tempObjectStore.transaction.oncomplete = (event) => {
        console.log('Added data to object store.')
      }
      syntheticData.forEach((user) => {
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

  let transaction = db.transaction(['newObjectStoreName'], 'readwrite')
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

  let store = transaction.objectStore('newObjectStoreName')

  // Retrieve a single entry.
  let new_request = store.get(1000002)
  new_request.onsuccess = (event) => {
    console.log(`Retrieval: ${JSON.stringify(event.target.result)}}`)
  }
  store.openCursor().onsuccess = (event) => {
    let cursor = event.target.result;

    if (cursor) {
      console.log(`Key: ${cursor.key}\t Value: ${cursor.value.entry}`)
      cursor.continue()
    }
  }
}
