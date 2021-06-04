import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'
import { MediaItem, MEDIA_TYPE } from './components/MediaItem.js'

const collapse = document.getElementById('collapse')
const imageBox = document.getElementById('image-collection')
const videoBox = document.getElementById('video-collection')
const gallery = document.getElementById('media-gallery')
const addBtn = document.querySelector('.addBtn')
const imageButton = document.getElementById('add-image-btn')
const videoButton = document.getElementById('add-video-btn')

/*
 * This onclick toggles the display style of the media gallery
 * TODO: When onclick, the size of the media gallery should be changed
 *
 */
collapse.addEventListener('click', () => {
  // console.log(collapse.innerHTML)
  if (collapse.innerHTML === '<i class="fa fa-chevron-up fa-2x"></i>') {
    gallery.style.display = 'none'
    collapse.innerHTML = '<i class="fa fa-chevron-down fa-2x"></i>'
  } else {
    gallery.style.display = 'flex'
    collapse.innerHTML = '<i class="fa fa-chevron-up fa-2x"></i>'
  }
})

addBtn.addEventListener('click', () => {
  newElement()
})

/**
 * Adds tasks, notes, and events to the daily log. If the entry is evmpty,
 * then the bullet journal alerts the user that they must write something
 * for that task/note/event.
 *
 */
function newElement () {
  const inputValue = document.getElementById('myInput').value
  if (inputValue.length === 0) {
    alert('You must write something!')
    return
  }
  const li = document.createElement('li')
  const logItem = document.createElement('log-item')
  logItem.finished = false
  const itemEntry = {}
  itemEntry.logType = 'task'
  itemEntry.description = inputValue
  li.appendChild(logItem)
  logItem.itemEntry = itemEntry
  logItem.setHoverListeners()
  document.getElementById('myUL').appendChild(li)
  document.getElementById('myInput').value = ''
}

/**
 * Business logic subroutine used to fill the page with
 * the tasks corresponding to a collection.
 * @param {Object} JSON object containing the collection
 * surfaced from indexedDB
 */
function populateTasks (collection) {
  // console.log(collection.items)
  function createLogItem (task) {
    const logItem = document.createElement('log-item')
    logItem.itemEntry = task
    return logItem
  }
  const tasks = collection.tasks
  const taskList = document.getElementById('myUL')
  tasks.forEach((task, index) => {
    const logItem = createLogItem(task)
    const li = document.createElement('li')
    li.appendChild(logItem)
    taskList.appendChild(li)
    logItem.setHoverListeners()
  })
}

/**
 * Business logic subroutine used to add the collection
 * name to the title of the page.
 * @param {Object} JSON object containing the collection
 * surfaced from indexedDB
 */
function populateCollectionName () {
  let name = window.location.hash.replace(/%20/g, ' ')
  name = name.slice(1)
  const title = document.querySelector('#title > h1')
  title.textContent = name
  return name
}

/**
 * Business logic subroutine used to populate the
 * media components of the given collection
 * @param {Object} collection JSON object containing the
 * collection images and videos to display
 */
function populateMedia (collection, mediaType = MEDIA_TYPE.IMAGE, hasVideo) {
  function createMediaItem (media) {
    const mediaItem = document.createElement('media-item')
    mediaItem.file = media.file
    mediaItem.media = mediaType
    return mediaItem
  }
  let target
  let mediaCollection
  let inputField
  let type
  if (mediaType === MEDIA_TYPE.IMAGE) {
    target = collection.images
    inputField = document.getElementById('add-image-btn')
    mediaCollection = document.getElementById('image-collection')
  } else {
    // this is for populating videos
    type = 'video'
    target = collection.videos
    inputField = document.getElementById('add-video-btn')
    mediaCollection = document.getElementById('video-collection')
  }
  // console.log(target.length)
  target.forEach((media, index) => {
    const mediaItem = createMediaItem(media)
    const vid = mediaItem.shadowRoot.querySelector('video')
    if (hasVideo && index === (target.length - 1)) {
      // @TODO Currently this only works for video
      // we might need to also consider image
      console.log(index)
      vid.addEventListener('canplaythrough', () => {
        document.getElementById('loading').style.display = 'none'
      })
    }
    mediaCollection.insertBefore(mediaItem, inputField)
  })
}

/**
 * Gets collection information as JSON corresponding to the field current_collection
 * in indexedDB. This collection data is passed as JSON to a callback to handle the
 * presentation logic for the page.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Function} cb Callback function, which takes a JSON object
 * representing the collection data being used
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
        let name = window.location.hash.slice(1)
        name = name.replace(/%20/g, ' ')
        // const collectionName = cursor.value.current_collection
        const collection = cursor.value.properties.collections.find((element) => {
          return element.name === name
        })
        console.log(collection)
        cb.bind(this)
        cb(collection)
      }
    }
  })
}

/**
 * Write transaction to indexedDB in order to update the current collection.
 * The manner in which our write transaction occurs depends on the specified
 * callback.
 * @param {Function} cb Callback function which takes collection data as JSON
 * and returns the modified collection to write to indexedDb
 */
function updateLogInfo (collectionName, cb) {
  const wrapper = new IndexedDBWrapper('experimentalDB', 1)

  wrapper.transaction((event) => {
    const db = event.target.result

    const transaction = db.transaction(['currentLogStore'], 'readwrite')
    const store = transaction.objectStore('currentLogStore')
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        const name = collectionName
        let collection = cursor.value.properties.collections.find((element) => {
          return element.name === name
        })
        collection = cb(collection)
        cursor.update(cursor.value)
      }
    }
  })
}

/**
 * Event handler for adding videos and images
 * to a collection. When a collection has a new
 * video/image, we must perform a write transaction
 * to indexedDB to save this media element, in addition
 * to performing the necessary presentation logic on the
 * page itself
 * @param {Number} media Enum value denoting whether an
 * image or video is being created.
 */
function insertMedia (collectionName, event, media = MEDIA_TYPE.IMAGE) {
  const selectedFile = event.target.files[0]
  const mediaItem = document.createElement('media-item')
  mediaItem.file = selectedFile
  mediaItem.media = media
  updateLogInfo(collectionName, (collection) => {
    const target = (media === MEDIA_TYPE.IMAGE) ? collection.images : collection.videos
    target.push({
      type: 'string',
      file: selectedFile
    })
    console.log(`pushed to ${media === MEDIA_TYPE.IMAGE ? 'images' : 'videos'}!`)
    return collection
  })
  if (media === MEDIA_TYPE.IMAGE) {
    const input = document.getElementById('add-image-btn')
    imageBox.insertBefore(mediaItem, input)
  } else {
    const input = document.getElementById('add-video-btn')
    document.getElementById('video-collection').appendChild(mediaItem)
    videoBox.insertBefore(mediaItem, input)
  }
}

/**
 * Business logic to call all necessary subroutines
 * to display colleciton data on the page
 * @param {Object} response JSON object containing the
 * collection data for the collection to view
 */
function populatePage (response) {
  populateTasks(response)
  populateMedia(response, MEDIA_TYPE.IMAGE, false)
  if (response.videos.length !== 0) {
    populateMedia(response, MEDIA_TYPE.VIDEO, true)
  } else {
    document.getElementById('loading').style.display = 'none'
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('dom content loaded')
  console.time()
  const collectionName = populateCollectionName()
  getLogInfoAsJSON(populatePage)
  console.timeEnd()

  imageButton.addEventListener('input', (event) => {
    insertMedia.bind(event)
    insertMedia(collectionName, event, MEDIA_TYPE.IMAGE)
  })
  videoButton.addEventListener('input', (event) => {
    insertMedia.bind(event)
    insertMedia(collectionName, event, MEDIA_TYPE.VIDEO)
  })
  // const vid = document.querySelector('media-item')
  // console.log(vid)
  // vid.addEventListener('loadeddata', function() {

  // if(vid.readyState <= 3) {
  //   console.log("loading")
  //   document.getElementById("loading").style.visibility = "visible"
  //   document.getElementById("collapse").style.visibility = "hidden"
  // }
})
