var collapse = document.getElementById('collapse');
var right = document.getElementById('right');
var quote = document.getElementById('quote');
console.log(right.style);
/*
 * This onclick toggles the display style of the quote to none
 * TODO: Collapse the whole div, not just the quote
 * Resource: https://codepen.io/Mdade89/pen/JKkYGq
 * the link above provides a collapsible text box
 */
collapse.addEventListener('click', ()=>{
  if(quote.style.display == 'none'){
    collapse.innerHTML = 'collapse';
    right.style.visibility = 'visible';
    quote.style.display = 'block';
  }else{
    collapse.innerHTML = 'expand';
    right.style.visibility = 'hidden';
    quote.style.display = 'none';
  }
})
function newElement() {
    var span = document.createElement('select');
    span.className='dropdown';
    var txt = document.createElement('option');
    let close = document.createElement('option');
    let complete = document.createElement('option');
    close.text = 'delete';
    close.value = 'close';
    close.className='close';
    complete.text = 'complete';
    complete.value = 'complete';
    complete.className='complete';
    txt.text = 'options';
    txt.value = 'value';
    //span.className = 'select';
    span.appendChild(txt);
    span.appendChild(close);
    span.appendChild(complete);
    var li = document.createElement('li');
    var inputValue = document.getElementById('myInput').value;
    var t = document.createTextNode(inputValue);
    li.appendChild(span);
    li.appendChild(t);
    if (inputValue === '') {
      alert('You must write something!');
    } else {
      //span.appendChild(li);
        //document.getElementById('myUL').appendChild(span);
      document.getElementById('myUL').appendChild(li);
    }
    document.getElementById('myInput').value = '';
  
  }