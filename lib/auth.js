var user = {
  authId: '',
  name: '',
  email: '',
  role: '',
  created: Date
}
var
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy

passport.serializeUser(function (user, done) {
  done(null, user._id)
})
passport.deserializeUser(function (id, done) {
  // User
})

module.exports = function (app, options) {
  if (!options.successRedirect) {
    options.successRedirect = '/account'
  }
  if (!options.failureRedirect) {
    options.failureRedirect = '/login'
  }
  return {
    init: function () {
      var env = app.get('env')
      var config = options.providers
      passport.use(new FacebookStrategy({
        clientID: config.facebook[env].appId,
        clientSecret: config.facebook[env].appSecret,
        callbackURL: (options.baseUrl || '') + '/auth/facebook/callback'
      }, function (accessToken, refreshToken, profile, done) {
        var authId = 'facebook' + profile.id
        user.authId = authId
        user.name = profile.displayName
        user.created = Date.now()
        user.role = 'customer'
        console.log(user)
      }))
      app.use(passport.initialize())
      app.use(passport.session())
    },
    registerRoutes: function () {
      app.get('/auth/facebook', function (req, res, next) {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect
        passport.authenticate('facebook')(req, res, next)
      })

      app.get('/auth/facebook/callback', passport.authenticate('facebook',
        { failureRedirect: options.failureRedirect }),
      function (req, res) {
        var redirect = req.session.authRedirect
        if (redirect) delete req.session.authRedirect
        res.redirect(303, redirect || options.successRedirect)
      })
    }
  }
}
/*
      app.get('/auth/facebook/callback', passport.authenticate('facebook',
        { failureRedirect: options.failureRedirect }),
        function(req, res){
          // we only get here on successful authentication
          var redirect = req.session.authRedirect;
          if(redirect) delete req.session.authRedirect;
          res.redirect(303, redirect || options.successRedirect);
        }
      );

      */
