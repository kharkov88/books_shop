var express = require('express'),
  app = express(),
  crud = require('./lib/crud'),
  routes = require('./lib/routes'),
  port = process.env.PORT || 3006

handlebarsInit(app)

app.use(express.static(__dirname + '/public'))

routes.configRoutes(app)

app.listen(port, function () {
  console.log('express started on ' + port)
})

function handlebarsInit (app) {
  var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null
      }
    }
  })
  app.engine('handlebars', handlebars.engine)
  app.set('view engine', 'handlebars')
}
