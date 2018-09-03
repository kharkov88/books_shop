var
  express = require('express'),
  app = express(),
  crud = require('./lib/crud'),
  routes = require('./lib/routes'),
  credentials = require('./credentials'),
  auth = require('./lib/auth')(app, {
    baseUrl: 'http://localhost:3006',
    providers: credentials.authProviders,
    successRedirect: '/accout',
    failureRedirect: '/unauthorized'
  }),
  port = process.env.PORT || 3006

auth.init()
auth.registerRoutes()

handlebarsInit(app)

app.use(express.static(__dirname + '/public'))
app.use(require('cookie-parser')(credentials.cookieSecret))
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}))
app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('csurf')())
app.use(function (req, res, next) {
  res.locals._csrfToken = req.csrfToken()
  next()
})

app.use(function (req, res, next) {
  console.log(req.session)
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})
routes.configRoutes(app)

app.use(function (req, res, next) {
  res.status(404)
  res.render('404')
})
// invalid csrf token
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500)
  res.render('500', {code: err.code})
})

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
