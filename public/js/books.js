window.onload = function () {
  var booksListTemplate = Handlebars.compile(
    document.querySelector('#booksTemplate').innerHTML
  )
  var url = '/books/list'
  fetch(url)
    .then(response => response.json())
    .then(obj => createList(obj))

  function createList (arr) {
    document.querySelector('#books').innerHTML = booksListTemplate({
      books: arr
    })
  }
}
