var
  crud = require('./crud'),
  makeMongoId = crud.makeMongoId

var fakeBook = {
  title: 'JavaScript',
  priceInCents: 9954,
  description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript thats more reliable, readable, and maintainable than the language as a whole—a subset you can use to create truly extensible and efficient code.',
  author: ['Duglas'],
  smallThumbnail: 'http://books.google.com/books/content?id=PXa2bby0oQ0C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api'
}

var configRoutes = function (app) {
  app.get('/', function (req, res) {
    res.render('home')
  })
  app.get('/books', function (req, res) {
    res.render('books')
  })
  app.get('/editor', function (req, res) {
    res.render('editor')
  })
  app.get('/:obj_type/list', function (req, res) {
    setTimeout(() => {
      crud.read(req.params.obj_type, (map) => res.send(map))
    }, 1500)
  })
  app.post('/:obj_type/insert', function (req, res) {
    console.log(req.body)
    crud.insert(
      req.params.obj_type,
      req.body || fakeBook,
      // (map) => res.send(map)
      () => res.redirect(303, '/editor')
    )
  })
  app.post('/:obj_type/update/:id', function (req, res) {
    crud.update(
      req.params.obj_type,
      {_id: makeMongoId(req.params.id)},
      req.body,
      (result) => res.redirect(303, '/editor')
    )
  })
  app.delete('/:obj_type/delete/:id', function (req, res) {
    crud.delete(
      req.params.obj_type,
      {_id: makeMongoId(req.params.id)},
      (result) => res.send(result)
    )
  })
}
module.exports = {
  configRoutes: configRoutes
}
