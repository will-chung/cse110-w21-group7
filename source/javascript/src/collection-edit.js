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
