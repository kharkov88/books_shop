var crud = require('./crud')
var fakeBook = {
  name: 'JavaScript',
  priceInCents: 9954,
  description: '123',
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
  app.get('/books/list', function (req, res) {
    crud.read('books', (map) => res.send(map))
  })
  app.get('/insert', function (req, res) {
    crud.insert('books', fakeBook, (map) => res.send(map))
  })
}
module.exports = {
  configRoutes: configRoutes
}
