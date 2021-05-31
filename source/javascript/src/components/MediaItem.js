import { IndexedDBWrapper } from '../indexedDB/IndexedDBWrapper.js'

const MEDIA_TYPE = {
  IMAGE: 0,
  VIDEO: 1
}

/**
 * Component class used in order to add individual
 * images/video to the collections-edit page.
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
class MediaItem extends HTMLElement {
  /**
       * Constructor containing the business logic for
       * creating a new media item.
       */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this._file = null
    this._media = MEDIA_TYPE.IMAGE
  }

  render () {
    this.shadowRoot.innerHTML = `<style>
                                    .container {
                                        display: flex;
                                        width: 400px;
                                        height: auto;
                                    }
                                    .media-wrapper {
                                        // align-self: stretch;
                                    }
                                    .media-wrapper > img {
                                        border-style: solid;
                                        border-width: 5px;
                                        border-radius: 20px;
                                        box-shadow: 20px 20px 20px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
                                        height: auto;
                                        width: 100%;
                                        display:inline-block;
                                    }
                                    .media-wrapper > video {
                                        height: auto;
                                        width: 100%;
                                        display:inline-block;
                                    }
                                    button {
                                        background-color: rgba(0, 0, 0, 0);
                                        border-radius: 200px;
                                        border-style: solid;
                                        padding:0;
                                        font-size: inherit;
                                        width: 3rem;
                                        height: 3rem;
                                        margin: auto;
                                        visibility: hidden
                                    }
                                    button:hover {
                                      visibility: visible;
                                      cursor: pointer;
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
                                        <span class="media-wrapper">
                                            <button type="button">
                                            <span class="icon trash-button-icon"></span>
                                            </button>
                                        </span>
                                    </span>`
    const wrapper = this.shadowRoot.querySelector('.media-wrapper')
    wrapper.appendChild(this.getMedia())
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
            let target
            if (that._media === MEDIA_TYPE.IMAGE) {
              target = collection.images
            } else {
              target = collection.videos
            }
            // filter does not act in place on existing collections, so target is a deep copy.
            target = target.filter((media, index) => {
              return media.file.name !== that._file.name
            })
            // since target is a deep copy, we need to update the existing collection
            if (that._media === MEDIA_TYPE.IMAGE) {
              collection.images = target
            } else {
              collection.videos = target
            }
            cursor.update(cursor.value)
          }
        }
      })
      event.target.parentElement.parentElement.remove()
    })
    this.setHoverListeners()
  }

  /*
  * Adds event listeners for all hover events on the collection item
  */
  setHoverListeners () {
    const trashIcon = this.shadowRoot.querySelector('button')
    // toggles visiblity of trash icon when mouse hovers
    this.addEventListener('mouseenter', () => {
      trashIcon.style.visibility = 'visible'
    })

    this.addEventListener('mouseleave', () => {
      trashIcon.style.visibility = 'hidden'
    })
    }
  /**
       * Setter for the file used to render the media item.
       * Setting the file triggers a re-render of this
       * component.
       * @param {File} file File object containing the image
       * to render.
       */
  set file (file) {
    this._file = file
    this.render()
  }

  /**
       * Getter for the file used to render the media item.
       * @return {File} File object containing the media item
       * displayed
       */
  get file () {
    return this._file
  }

  /**
       * Setter for the media type used to render the
       * component.
       * Changing the media type triggers a re-render of this
       * component.
       * @param {Number} media enum value from the field MEDIA_TYPE.
       * The possible values are MEDIA_TYPE.IMAGE (0) and MEDIA_TYPE.VIDEO (1)
       */
  set media (media) {
    this._media = media
    this.render()
  }

  /**
       * Getter for the media type used to render the component.
       * @return {Number} Enum value containing the enum
       * from the field MEDIA_TYPE
       */
  get media () {
    return this._media
  }

  /**
     * Subroutine used to make an <img> element
     * from the field _file.
     * @returns {HTMLElement} HTMLImageElement or HTMLVideoElement containing
     * the source corresponding to the field _file
     */
  getMedia () {
    let media
    if (this._media === MEDIA_TYPE.IMAGE) {
      media = document.createElement('img')
    } else {
      media = document.createElement('video')
      media.controls = true
    }
    media.file = this._file

    const reader = new FileReader()
    reader.onload = (event) => {
      media.src = event.target.result
    }
    reader.readAsDataURL(this._file)
    return media
  }
}

customElements.define('media-item', MediaItem)

export { MediaItem, MEDIA_TYPE }
