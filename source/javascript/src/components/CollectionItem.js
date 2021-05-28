import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'

/**
 * Component class for individual collections on 'collections.html'
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class CollectionItem extends HTMLElement {
  /**
       * Constructor containing the business logic for
       * creating a new container item.
       */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    // Unfortunately this cannot be made a private field, since ESLint does not properly
    // lint private fields.
    this._entry = { name: '' }
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                      @import url(https://fonts.googleapis.com/css?family=Titillium+Web:300);
                                      .icon-collection {
                                          background-size: contain;
                                          width:50%;
                                          height:50%;
                                          margin:auto;
                                      }
                                      .icon-trash {
                                        background-size: contain;
                                        width:2em;
                                        height:2em;
                                      }
                                      .trash-button-icon {
                                        background: url(../images/log-item_icons/trash-solid.svg) no-repeat center center;
                                      }
                                      .folder {
                                        margin-right: 1vw;
                                        border-bottom-style:solid;
                                        border-width:7px;
                                        border-radius: 10px;
                                        display:flex;
                                        flex-direction: column;
                                        align-items: flex-start;
                                        /*TODO: change the width*/
                                        justify-content: center;
                                        width:400px;
                                        margin: 10px;
                                      }
                                      a {
                                        text-decoration:none;
                                        color:rgba(0,0,0,1);
                                      }
                                      h1 {
                                        font-family: 'Pattaya', sans-serif;
                                        margin:auto;
                                      }
                                      button {
                                          background-color: rgba(0,0,0,0);
                                          border:0;
                                          padding:0;
                                          font-size: inherit;
                                      }
                                      </style>
                                    <div class="folder">
                                        <span class="icon-trash trash-button-icon"></span>
                                        <img src="/source/images/icon-collection.svg" class="icon-collection">
                                        <h1><a href="/source/html/collection-edit.html">${this.getCollectionName()}</a></h1>
                                    </div>`
    this.shadowRoot.querySelector('span[class="icon-trash trash-button-icon"]').addEventListener('click', (event) => {
      /**
       * onClick remove from page and from database
       */

      // Get clicked collection-item
      const collectionItem = event.target.getRootNode().host
      // Get name of clicked collection
      const name = collectionItem.getCollectionName()

      // Create indexedDBWrapper
      const wrapper = new IndexedDBWrapper('experimentalDB', 1)

      // Open a transaction and objectStore to 'currentLogStore'
      wrapper.transaction((event) => {
        const db = event.target.result

        const transaction = db.transaction(['currentLogStore'], 'readwrite')
        const objectStore = transaction.objectStore('currentLogStore')
        objectStore.openCursor().onsuccess = function (event) {
          const cursor = event.target.result
          if (cursor) {
            /* Update collections array to remove collection with
             * name given by this._entry.name (see below)
             * https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor/update
             */

            // Get JSON
            const json = cursor.value

            // Get collections array
            const collectionsArray = json.properties.collections
            // index of collection to remove
            let index

            // Search for collection to remove
            collectionsArray.forEach(collection => {
              if (collection.name === name) {
                index = collectionsArray.indexOf(collection)
              }
            })

            // Remove collection
            collectionsArray.splice(index, 1)

            // Save changes
            const requestUpdate = cursor.update(json)
            requestUpdate.onerror = function (event) {
              // Do something with the error
            }
            requestUpdate.onsuccess = function (event) {
              // Success - the data is updated!
              console.log('successfully removed "' + name + '"')
            }
          }
        }
      })
      event.target.parentElement.remove()
    })


    this.dataset.name = this._entry.name
    this.shadowRoot.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      
      // read/write transactions
      // 
      let that = this
      const wrapper = new IndexedDBWrapper('experimentalDB', 1)

      wrapper.transaction((event) => {
        const db = event.target.result

        const transaction = db.transaction(['currentLogStore'], 'readwrite')
        const objectStore = transaction.objectStore('currentLogStore')
        objectStore.openCursor().onsuccess = function (event) {
          const cursor = event.target.result
          if (cursor) {
            // Get JSON
            const json = cursor.value

            // Set current_collection field
            json.current_collection = that.dataset.name

            // Save changes
            const requestUpdate = cursor.update(json)
            requestUpdate.onerror = function (event) {
              // Do something with the error
            }
            requestUpdate.onsuccess = function (event) {
              // Success - the data is updated!
              console.log('successfully saved "' + json.current_collection + '"')
            }
          }
        }
      })

      // unsuspend navigation
      window.location.href = '/source/html/collection-edit.html'
    })
  }

  /**
     * Gets the corresponding collection name
     * @returns {String} name of the collection. If specified
     * as an empty string, "Collection" is returned instead.
     */
  getCollectionName () {
    return this._entry.name === '' ? 'Collection' : this._entry.name
  }

  /**
       * Setter for private field entry, containing
       * the name of our collection.
       * @param {Object} entry JSON object containing the
       * new fields for our log item.
       */
  set entry (entry) {
    this._entry = entry
    this.render()
  }

  /**
       * Getter for private field entry, containing the
       * name of our collection.
       * @return {Object} JSON object containing the
       * new fields for our collection item.
       */
  get entry () {
    return this._entry
  }
}

customElements.define('collection-item', CollectionItem)

export { CollectionItem }
