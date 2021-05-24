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
      event.target.parentElement.remove()
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
