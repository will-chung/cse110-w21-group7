import { IndexedDBWrapper as IndexedDBWrapper } from './../indexedDB/IndexedDBWrapper.js'

/**
 * Component class used in order to add individual
 * images to the collections-edit page.
 * @author Noah Teshima <nteshima@ucsd.edu>
 */
 class ImageItem extends HTMLElement {
    /**
       * Constructor containing the business logic for
       * creating a new image.
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
                                    .image-wrapper {
                                        align-self: stretch;
                                    }
                                    .image-wrapper > img {
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
                                        <span class="image-wrapper">
                                            <button type="button">
                                            <span class="icon trash-button-icon"></span>
                                            </button>
                                        </span>
                                    </span>`
      let wrapper = this.shadowRoot.querySelector('.image-wrapper')
      wrapper.appendChild(this.getImage())
      let that = this
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
                let collection = cursor.value.properties.collections.find((element) => {
                return element.name === collectionName
                })
                collection.images = collection.images.filter((image, index) => {
                    return image.file.name !== that._file.name
                })
                cursor.update(cursor.value)
            }
            }
        })
        event.target.parentElement.parentElement.remove()
      })
    }
  
    /**
       * Setter for the file used to render the image.
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
       * Getter for the file used to render the image
       * @return {File} File object containing the image
       * displayed
       */
    get file () {
      return this._file
    }

    /**
     * Subroutine used to make an <img> element
     * from the field _file.
     * @returns {HTMLImageElement} Image element containing
     * the source corresponding to the field _file
     */
    getImage() {
        let img = document.createElement('img')
        img.file = this._file
        const reader = new FileReader()
        reader.onload =  (event) => {
            img.src = event.target.result
        }
        reader.readAsDataURL(this._file)
        return img
    }
  }
  
  customElements.define('image-item', ImageItem)
  