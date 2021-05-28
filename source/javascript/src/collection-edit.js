import { IndexedDBWrapper as IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'

const collapse = document.getElementById('collapse')
const imageBox = document.getElementById('image-collection')
const videoBox = document.getElementById('video-collection')
const gallery = document.getElementById('media-gallery')
/*
 * This onclick toggles the display style of the media gallery
 * TODO: When onclick, the size of the media gallery should be changed
 *
 */
collapse.addEventListener('click', () => {
  if (collapse.innerHTML === 'expand') {
    collapse.innerHTML = 'collapse'
    imageBox.style.visibility = 'visible'
    videoBox.style.display = 'block'
    gallery.style.visibility = 'visible'
  } else {
    collapse.innerHTML = 'expand'
    imageBox.style.visibility = 'hidden'
    videoBox.style.display = 'none'
    gallery.style.visibility = 'hidden'
  }
})
function newElement () {
  const span = document.createElement('select')
  span.className = 'dropdown'
  const txt = document.createElement('option')
  const close = document.createElement('option')
  const complete = document.createElement('option')
  close.text = 'delete'
  close.value = 'close'
  close.className = 'close'
  complete.text = 'complete'
  complete.value = 'complete'
  complete.className = 'complete'
  txt.text = 'options'
  txt.value = 'value'
  // span.className = 'select';
  span.appendChild(txt)
  span.appendChild(close)
  span.appendChild(complete)
  const li = document.createElement('li')
  const inputValue = document.getElementById('myInput').value
  const t = document.createTextNode(inputValue)
  li.appendChild(span)
  li.appendChild(t)
  if (inputValue === '') {
    alert('You must write something!')
  } else {
    // span.appendChild(li);
    // document.getElementById('myUL').appendChild(span);
    document.getElementById('myUL').appendChild(li)
  }
  document.getElementById('myInput').value = ''
}

/**
 * Business logic subroutine used to fill the page with
 * the tasks corresponding to a collection.
 * @param {Object} JSON object containing the collection
 * surfaced from indexedDB
 */
function populateTasks(collection) {
  function createLogItem(task) {
    let logItem = document.createElement('log-item')
    logItem.itemEntry = task
    return logItem
  }
  let tasks = collection.tasks
  let taskList = document.getElementById('myUL')
  tasks.forEach((task, index) => {
    let logItem = createLogItem(task)
    let li = document.createElement('li')
    li.appendChild(logItem)
    taskList.appendChild(li)
  })
}

/**
 * Business logic subroutine used to add the collection
 * name to the title of the page.
 * @param {Object} JSON object containing the collection
 * surfaced from indexedDB
 */
function populateCollectionName(collection) {
  let name = collection.name
  let title = document.querySelector('#title > h1')
  title.textContent = name
}

/**
 * Daily log information corresponding to the given date.
 * If there is no daily log information for the given date,
 * a new daily log is created if the date is the present day.
 * @author Noah Teshima <nteshima@ucsd.edu>
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
        let collection_name = cursor.value.current_collection
        let collection = cursor.value.properties.collections.find((element) => {
          return element.name === collection_name
        })
        cb.bind(this)
        cb(collection)
      }
    }
  })
}

/**
 * Business logic to call all necessary subroutines
 * to display colleciton data on the page
 * @param {Object} response JSON object containing the
 * collectin data for the collection to view
 */
 function populatePage (response) {
  populateTasks(response)
  populateCollectionName(response)
}


document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(populatePage)
})



