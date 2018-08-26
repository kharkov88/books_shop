var app = require('express')(),
  crud = require('./lib/crud'),
  routes = require('./lib/routes'),
  port = process.env.PORT || 3006

routes.configRoutes(app)

app.listen(port, function () {
  console.log('express started on ' + port)
})
