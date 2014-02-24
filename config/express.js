/**
 * Module dependencies.
 */
 var express = require('express')
 , mongoose = require('mongoose')
 , mongoStore = require('connect-mongo')(express)
 , flash = require('connect-flash')
 , helpers = require('view-helpers')
 , ejs = require('ejs')

 module.exports = function (app, config) {

  app.set('showStackError', true)
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))
  app.use(express.favicon())
  app.use(express.static(config.root + '/public'))

  if (process.env.NODE_ENV == 'development') {
    app.use(express.logger('dev'))
    console.log('development version')
    mongoose.set('debug',true)
  }

  // set views path, template engine and default layout
  //ejs as html
  app.set('views', config.root + '/app/views')
  app.engine('html', ejs.renderFile)

  app.enable("jsonp callback")

  app.configure(function () {
    app.use(express.cookieParser())
    app.use(express.bodyParser())
    // dynamic helpers
    app.use(helpers(config.app.name))

    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    // express/mongo session storage
    app.use(express.session({
      secret: 'keiin-secret-Keiin2014',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    // connect flash for flash messages
    app.use(flash())

    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) 
        return next()

      err = (err && err.stack) || err || 'internal server error';
      
      // log it
      console.error('ERR[ '+err+' ]')
      // error page
      res.status(500).render('500.html', { error: 'some internal server error' })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404.html', { url: req.originalUrl, error: 'Not found' })
    })

  })
}
