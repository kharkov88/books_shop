var
  credentials = require('../credentials'),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  db = null

readAllItem = function (obj_type, callback) {
  var collection = db.collection(obj_type)
  collection.find().toArray(function (err, map) {
    callback(map)
  })
}

insertItem = function (obj_type, obj_map, callback) {
  var collection = db.collection(obj_type)
  collection.insertMany([obj_map], function (err, result) {
    callback(result)
  })
}

deleteItem = function (obj_type, id, callback) {
  var collection = db.collection(obj_type)
  console.log(id)
  collection.findOne(id)
    .then(obj => collection.deleteOne(obj, (err, result) => callback(result)))
}

updateItem = function (obj_type, id_obj, set_obj, callback) {
  var collection = db.collection(obj_type, function (err, collection) {
    var
      opt_map = {
        multi: true,
        upsert: false,
        safe: true
      }
    collection.update(
      id_obj,
      { $set: set_obj },
      opt_map,
      function (err, update_map) {
        callback(update_map)
      })
  })
}
module.exports = {
  makeMongoId: mongodb.ObjectId,
  read: readAllItem,
  insert: insertItem,
  delete: deleteItem,
  update: updateItem
}
// connect to mongo
MongoClient.connect(
  credentials.mongo.development.connection,
  { useNewUrlParser: true },
  function (err, client) {
    console.log('connected to db')
    db = client.db('test1')
  })
