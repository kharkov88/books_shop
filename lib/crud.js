var credentials = require('../credentials'),
  mongoose = require('mongoose'),
  MongoClient = require('mongodb').MongoClient,
  db = null

readAllBooks = function (obj_type, callback) {
  var collection = db.collection(obj_type)
  collection.find().toArray(function (err, map) {
    callback(map)
  })
}

insertBook = function (obj_type, obj_map, callback) {
  var collection = db.collection(obj_type)
  collection.insertMany([obj_map], function (err, result) {
    callback(result)
  })
}
module.exports = {
  read: readAllBooks,
  insert: insertBook
}
// connect to mongo
MongoClient.connect(
  credentials.mongo.development.connection,
  { useNewUrlParser: true },
  function (err, client) {
    console.log('connected to db')
    db = client.db('test1')
  })
