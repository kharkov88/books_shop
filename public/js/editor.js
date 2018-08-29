window.onload = function () {
  var
    booksListTemplate = Handlebars.compile(document.querySelector('#booksTemplate').innerHTML),
    formAddTemplate = Handlebars.compile(document.querySelector('#formAddTemplate').innerHTML),
    btnAdd = document.querySelector('#add-book'),
    btnGetList = document.querySelector('#get-list')

  function getList () {
    var url = '/books/list'
    document.querySelector('#editor-content').innerHTML = "<img src='\/img/loading.gif'/>"
    fetch(url)
      .then(response => response.json())
      .then(obj => createList(obj))
      .then(() => initControls())
  }

  function createList (arr) {
    document.querySelector('#editor-content').innerHTML = booksListTemplate({
      books: arr
    })
  }

  function initControls () {
    var
      items = document.querySelectorAll('.editor-content-item'),
      btnsDeleteItem = document.querySelectorAll('.editor-delete-item'),
      btnsChangeItem = document.querySelectorAll('.editor-change-item')

    btnsChangeItem.forEach(function (item, i) {
      item.addEventListener('click', function () {
        var context = {
          title: this.dataset.itemTitle,
          author: this.dataset.itemAuthor,
          price: this.dataset.itemPrice,
          imgLink: this.dataset.itemImglink,
          description: this.dataset.itemDescription,
          route: this.dataset.action
        }
        generateForm(context)
      })
    })

    btnsDeleteItem.forEach(function (item, i) {
      item.parent = items[i]
      item.addEventListener('click', function () {
        var id = this.dataset.itemId
        var url = '/books/delete/' + id
        fetch(url, {
          method: 'DELETE'
        })
          .then(() => { this.parent.parentElement.removeChild(this.parent) })
      })
    })
  }

  function generateForm (context) {
    console.log('context:', context)
    document.querySelector('#editor-content').innerHTML = formAddTemplate(context)
  }

  // ------init module
  getList()
  btnAdd.addEventListener('click', () => generateForm({route: 'books/insert'}))
  btnGetList.addEventListener('click', getList)
}
