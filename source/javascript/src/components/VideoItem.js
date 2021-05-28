import { IndexedDBWrapper } from './../indexedDB/IndexedDBWrapper.js'

/**
 * Component class used in order to add individual
 * videos to the collections-edit page.
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class VideoItem extends HTMLElement {
  /**
       * Constructor containing the business logic for
       * creating a new video.
       */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this._file = null
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    .container {
                                        display: flex;
                                        width: 400px;
                                        height: auto;
                                    }
                                    .video-wrapper {
                                        align-self: stretch;
                                    }
                                    .video-wrapper > img {
                                        height: auto;
                                        width: 100%;
                                        display:inline-block;
                                    }
                                    button {
                                        background-color: rgba(0, 0, 0, 0);
                                        border:0;
                                        padding:0;
                                        font-size: inherit;
                                        width: 5rem;
                                        height: 5rem;
                                        margin: auto;
                                    }
                                    .icon {
                                        background-size: contain;
                                        display: inline-block;
                                        width: 50%;
                                        height: 50%;
                                        margin: auto;
                                    }
                                    .trash-button-icon {
                                        background: url(../images/log-item_icons/trash-solid.svg) no-repeat center center;
                                    }
                                    </style>
                                    <span class="container">
                                        <span class="video-wrapper">
                                            <button type="button">
                                                <span class="icon trash-button-icon"></span>
                                            </button>
                                        </span>
                                    </span>`
    const wrapper = this.shadowRoot.querySelector('.video-wrapper')
    wrapper.appendChild(this.getVideo())
    const that = this
    this.shadowRoot.querySelector('button').addEventListener('click', (event) => {
      const wrapper = new IndexedDBWrapper('experimentalDB', 1)
      wrapper.transaction((event) => {
        const db = event.target.result

        const transaction = db.transaction(['currentLogStore'], 'readwrite')
        const store = transaction.objectStore('currentLogStore')
        store.openCursor().onsuccess = function (event) {
          const cursor = event.target.result
          if (cursor) {
            const collectionName = cursor.value.current_collection
            const collection = cursor.value.properties.collections.find((element) => {
              return element.name === collectionName
            })
            collection.videos = collection.videos.filter((video, index) => {
              return video.file.name !== that._file.name
            })
            cursor.update(cursor.value)
          }
        }
      })
      event.target.parentElement.parentElement.remove()
    })
  }

  /**
       * Setter for the file used to display the video.
       * Setting the file triggers a re-render of this
       * component.
       * @param {File} file File object containing the video
       * to display.
       */
  set file (file) {
    this._file = file
    this.render()
  }

  /**
       * Getter for the file used to display the video
       * @return {File} File object containing the video
       * displayed
       */
  get file () {
    return this._file
  }

  /**
     * Subroutine used to make an <img> element
     * from the field _file.
     * @returns {HTMLVideoElement} Video element containing
     * the source corresponding to the field _file
     */
  getVideo () {
    const video = document.createElement('video')
    video.file = this._file
    video.controls = true
    const reader = new FileReader()
    reader.onload = (event) => {
      video.src = event.target.result
    }
    reader.readAsDataURL(this._file)
    return video
  }
}

customElements.define('video-item', VideoItem)
