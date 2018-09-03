window.onload = function () {
  var local = window.localStorage
  var booksListTemplate = Handlebars.compile(
    document.querySelector('#booksTemplate').innerHTML
  )
  var url = '/books/list'
  fetch(url)
    .then(response => response.json())
    .then(obj => createList(obj))
    .then(() => init())

  function createList (arr) {
    document.querySelector('#books').innerHTML = booksListTemplate({
      books: arr
    })
  }

  var state = {
    basket: $('#main-basket'),
    ids: (local.ids && JSON.parse(local.ids)) || {}
  }
  function Observerable () {
    this.observers = []

    this.addObserver = function (observer) {
      this.observers.push(observer)
    }
    this.sendMsg = function (msg) {
      for (var i = this.observers.length - 1; i >= 0; i--) {
        this.observers[i].notify(msg)
      }
    }
  }

  function Observer (behavior) {
    this.notify = function (msg) {
      behavior(msg)
    }
  }

  var observerable = new Observerable()
  var observerBasket = new Observer(msg => {
    state.basket.toggleClass('hover')
    state.basket.text(Object.keys(state.ids).length)
    setTimeout(() => state.basket.toggleClass('hover'), 300)
  })
  var observerStore = new Observer(msg => {
    if (state.ids[msg]) return
    state.ids[msg] = 1
    window.localStorage.ids = JSON.stringify(state.ids)
  })
  observerable.addObserver(observerBasket)
  observerable.addObserver(observerStore)
  function init () {
    var btns = document.querySelectorAll('#button-buy')
    btns.forEach(function (item) {
      item.onclick = function () {
        var id = this.dataset.id
        observerable.sendMsg(id)
        console.log(state.ids)
      }
    })
  }
}
