const collapse = document.getElementById('collapse')
const right = document.getElementById('right')
const quote = document.getElementById('reflection')
const text = document.getElementById('text-input')
const date = document.getElementById('date-input')
const time = document.getElementById('time-input')
const saveBtn = document.getElementById('save')
const cancelBtn = document.getElementById('cancel')
const noteRadio = document.getElementById('input1')
const eventRadio = document.getElementById('input2')
const taskRadio = document.getElementById('input3')
const refRadio = document.getElementById('input4')
const radioContainer = document.getElementsByClassName('container')[0]
/*
 * This onclick toggles the display style of the quote to none
 * TODO: Collapse the whole div, not just the quote
 * Resource: https://codepen.io/Mdade89/pen/JKkYGq
 * the link above provides a collapsible text box
 */
document.addEventListener('DOMContentLoaded', () => {
  text.type = 'hidden'
  date.type = 'hidden'
  time.type = 'hidden'
})

radioContainer.addEventListener('change', () => {
  if (noteRadio.checked || refRadio.checked) {
    text.type = 'text'
    date.type = 'hidden'
    time.type = 'hidden'
  } else if (eventRadio.checked || taskRadio.checked) {
    text.type = 'text'
    date.type = 'date'
    time.type = 'time'
  } else {
    text.type = 'hidden'
    date.type = 'hidden'
    time.type = 'hidden'
  }
})

collapse.addEventListener('click', () => {
  if (quote.style.display === 'none') {
    collapse.removeChild(collapse.childNodes[0])
    const downArrow = document.createElement('i')
    downArrow.className = 'fa fa-chevron-up fa-lg'
    collapse.appendChild(downArrow)
    right.style.visibility = 'visible'
    quote.style.display = 'block'
  } else {
    collapse.removeChild(collapse.childNodes[0])
    const upArrow = document.createElement('i')
    upArrow.className = 'fa fa-chevron-down fa-lg'
    collapse.appendChild(upArrow)
    right.style.visibility = 'hidden'
    quote.style.display = 'none'
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
    document.getElementById('myUL').appendChild(li)
  }
  document.getElementById('myInput').value = ''
}

/**
 * Performs an AJAX call for JSON type response containing
 * the daily log information corresponding to the given date.
 * If there is no daily log information for the given date,
 * a new daily log is created if the date is the present day.
 * @author Noah Teshima <nteshima@ucsd.edu>
 * @param {Date} date Date object containing the corresponding date. Based
 * on the timestamp of the given Date object, a JSON type response will
 * be returned containing the corresponding daily log information. If no
 * date is specified, a Date object is initialized for the present day.
 * @throws Error object if date reference is null, undefined. Otherwise,
 * an error is thrown if the given date is not the present day and failed
 * to retrieve log info for given day.
 * @returns JSON type response, containing the information needed to
 * initialize the daily log.
 */
function getLogInfoAsJSON (date = new Date(), cb) {
  if (!(date instanceof Date) || (date === null)) {
    throw Error('date reference must be an instance of Date.')
  }

  const req = new XMLHttpRequest()
  req.onreadystatechange = function () {
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      cb.apply(this)
    }
  }

  req.open('GET', '../mock_data/daily_log.json', true)
  req.send()
}

/* Business logic */

function populateDailyLog () {

}

function setDate () {
  const response = JSON.parse(this.responseText)
  const date = response.date

  const dateElement = document.querySelector('#title > .date')
  dateElement.innerText = date
}

function sendLogInfoAsJSON () {
  // @TODO
}

document.addEventListener('DOMContentLoaded', (event) => {
  getLogInfoAsJSON(new Date(), setDate)
})
