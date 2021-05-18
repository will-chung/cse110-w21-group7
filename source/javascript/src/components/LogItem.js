export class LogItem extends HTMLElement {
    /**
     * Constructor containing the business logic for
     * creating a new log item. Log items are formatted as
     * follows:
     * <span>
            <span><i>symbol type</i></span>
            <b>Time</b>
            <span>Description</span>
            <button type="button"><i class="fa fa-trash-o"></i></button>
        </span>
     */
    constructor() {
        super()

        let template = document.createElement('template')

        template.innerHTML = '<span>'
                            + '<span><i>symbol type</i></span>'
                            + '<b>Time</b>'
                            + '<span>Description</span>'
                            + '<button type="button"><i class="fa fa-trash-o"></i></button>'
                            + '</span>'
        // const container = document.createElement('span')
        // const type = document.createElement('span')
        // const time = document.createElement('b')
        // const description = document.createElement('span')
        // const trashButton = document.createElement('button')
        // const trashIcon = document.createElement('i')

        // container.appendChild(type)
        // container.appendChild(time)
        // container.appendChild(description)
        // container.appendChild(trashButton)
        // trashButton.appendChild(trashIcon)

        // trashIcon.classList.add('fa')
        // trashIcon.classList.add('fa-trash-o')
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Gets the description of the corresponding log item.
     * @returns {String} String object containing the description.
     */
    get description() {
        let desc = this.querySelector('span > span:last-of-type').textContent
        return desc
    }

    /**
     * Sets the corresponding description for the log item.
     * @param {String} description String object containing the description.
     * @throws {Error} if the description is undefined
     */
    set description(description) {
        if (description === undefined) {
            throw new Error('The description must not be undefined.')
        }
        this.querySelector('span > span:last-of-type').textContent = description
    }

    /**
     * Gets the corresponding time for the given log item.
     * @returns {String} String object containing the time in
     * military time (HH:MM), where HH denotes the hour on the
     * open interval [0, 24) and MM denotes the minutes on the open
     * interval [0, 60). If the type of the given log item is not
     * an event, the returned time is undefined.
     */
    get time() {
        let time = this.querySelector('b').textContent
        return (time === '' ? undefined : time);
    }

    /**
     * Sets the corresponding time for the given log item.
     * @param {Date} time Date object containing the corresponding
     * hour and minute corresponding to the given event.
     * @throws {TypeError} if the log type is not an event, or if time is
     * not of type Date.
     */
    set time(time) {
        if (this.logType !== 'event') {
            throw new TypeError('<log-item> only permits time for events.')
        } else if (!(time instanceof Date)) {
            throw new TypeError('time should be an instance of Date.')
        }
        const hours = time.getHours()
        const minutes = time.getMinutes()
        this.querySelector('b').textContent = `${hours}:${minutes}`
    }
    
    /**
     * Get the corresponding type of the given log item. 
     * @returns {String} corresponding to type of given log
     */
    get logType() {
        let type = this.querySelector('span > span:first-of-type').className
        return type
    }

    /**
     * Sets the log type for the given item
     * @param {String} type object containing the corresponding log
     * type ("task", "note", "event")
     * @throws {TypeError} if the given type is undefined
     */
    set logType(type) {
        if (type === undefined) {
            throw TypeError('<log-item> requires a type.')
        }
        this.querySelector('span > span:first-of-type').className = type
    }
}


customElements.define('log-item', LogItem)


// export { LogItem }
