window.onload = function () {
  var
    state = {
      modalRequest: $('#modalRequest'),
      modalDeleteItem: $('#modalDeleteItem'),
      editorContent: $('#editor-content')[0],
      insert: '/books/insert',
      update: '/books/update/',
      read: '/books/list',
      destroy: '/books/delete/',
      loader: '<div class="preloader"><img src="/img/loading.gif"/></div>'
    },
    booksListTemplate = Handlebars.compile(document.querySelector('#booksTemplate').innerHTML),
    formTemplate = Handlebars.compile(document.querySelector('#formAddTemplate').innerHTML)

  var ctrlRead = {
    element: document.querySelector('#get-list'),
    init: function () {
      this.element.onclick = mediator.read
    }
  }

  var ctrlAddBook = {
    element: document.querySelector('#add-book'),
    init: function () {
      this.element.onclick = mediator.getContentForFormInsert
    }
  }

  var ctrlUpdate = {
    elements: [],
    init: function () {
      this.elements = document.querySelectorAll('.editor-change-item')
      this.elements.forEach(function (item) {
        item.onclick = mediator.getContentForFormUpdate.bind(item)
      })
    }
  }

  var ctrlDelete = {
    elements: [],
    init: function () {
      this.elements = document.querySelectorAll('.editor-delete-item')
      this.elements.forEach(function (item) {
        item.onclick = mediator.handleDelete.bind(item)
      })
    }
  }

  var content = {
    element: state.editorContent,

    createContent: function (content, callback) {
      callback = callback || (() => {})
      this.element.innerHTML = content
      callback()
    }
  }
  var modalDeleteItem = {
    element: document.querySelector('#btn-yes'),
    init: function () {
      modalDeleteItem.element.onclick = () => {
        state.modalDeleteItem.modal('toggle')
        mediator.destroy.call(this)
      }
    }
  }
  var request = {
    read: function () {
      mediator.startRequest()

      fetch(state.read)
        .then(response => response.json())
        .then(obj => {
          state.list = obj
          mediator.getContentForList(obj)
        })
        .then(() => setTimeout(() => { mediator.endRequest() }, 300))
    },
    destroy: function () {
      var id = this.dataset.itemId
      var csrf = this.dataset.csrf

      fetch(state.destroy + id, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: '_csrf=' + csrf
      })
        .then(() => {
          // this.parent.parentElement.removeChild(this.parent)
          mediator.read()
        })
    }
  }

  var mediator = {
    read: function () {
      request.read()
    },
    handleDelete: function () {
      state.modalDeleteItem.modal('toggle')
      modalDeleteItem.init.call(this)
    },
    destroy: function () {
      console.log(this)
      request.destroy.call(this)
    },
    getContentForList: function (obj) {
      content.createContent(booksListTemplate({books: obj}), () => {
        ctrlUpdate.init()
        ctrlDelete.init()
      })
    },
    getContentForFormInsert: function (obj) {
      content.createContent(formTemplate({route: state.insert}), () => {
      })
    },
    getContentForFormUpdate: function () {
      var id = this.dataset.itemId
      var item = state.list.filter(item => item._id === id)[0]
      console.log(item)
      var context = {
        title: item.title,
        author: item.author,
        price: item.price,
        imgLink: item.imgLink,
        description: item.description,
        route: state.update + id
      }
      content.createContent(formTemplate(context), () => {
      })
    },
    startRequest: function () {
      content.createContent(state.loader)
      state.modalRequest.modal({backdrop: 'static'})
    },
    endRequest: function () {
      state.modalRequest.modal('toggle')
    },
    init: function () {
      mediator.read()
      ctrlRead.init()
      ctrlAddBook.init()
      modalDeleteItem.init()
    }
  }

  mediator.init()
}
