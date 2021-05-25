(function () {
  const $body = document.body
  const $menuTrigger = $body.getElementsByClassName('menu-trigger')[0]

  if (typeof $menuTrigger !== 'undefined') {
    $menuTrigger.addEventListener('click', function () {
      $body.className = ($body.className === 'menu-active') ? '' : 'menu-active'
    })
  }
}).call(this)

const shelves = document.getElementsByTagName('book-shelf');

for (let i = 0; i < shelves.length; i++) {
  const shelf = shelves[i];
  shelf.label = 2021 + i;
  const books = shelf.booksArray;
  for (let j = 0; j < books.length; j++) {
    books[j].title = j+1;
    books[j].shelf = shelf.label;
  }
}

